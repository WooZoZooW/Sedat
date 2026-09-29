import { HubStore } from "./store.mjs";
import { LEASE_MS, validateCreateBody } from "./tasks.mjs";

export { HubStore };

const encoder = new TextEncoder();
const json = (data, status = 200) => Response.json(data, { status, headers: { "cache-control": "no-store" } });
const error = (code, status) => json({ error: code }, status);
const DASHBOARD_SESSION_MS = 8 * 60 * 60 * 1000;
let jwksCache;

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "="));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch { return null; }
}

async function sha256Hex(value) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  return [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function verifyDashboardPassword(password, encodedHash) {
  const parts = typeof encodedHash === "string" ? encodedHash.split("$") : [];
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") return false;
  const iterations = Number(parts[1]);
  const salt = base64UrlToBytes(parts[2]);
  const expected = base64UrlToBytes(parts[3]);
  if (!Number.isInteger(iterations) || iterations < 100_000 || iterations > 1_000_000 || !salt || salt.length < 16 || !expected || expected.length !== 32) return false;
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256));
  let difference = 0;
  for (let index = 0; index < expected.length; index++) difference |= expected[index] ^ actual[index];
  return difference === 0;
}

function dashboardCookie(token, maxAge = DASHBOARD_SESSION_MS / 1000) {
  return `agent_hub_session=${token}; Path=/v1/dashboard; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

function sessionToken(request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)agent_hub_session=([A-Za-z0-9_-]{40,64})(?:;|$)/);
  return match?.[1];
}

function dashboardTask(task) {
  const fields = ["id", "projectId", "state", "command", "createdAt", "updatedAt", "attempt", "startedAt", "completedAt", "failedAt"];
  const result = Object.fromEntries(fields.filter((key) => task[key] !== undefined).map((key) => [key, task[key]]));
  if (task.result && typeof task.result.summary === "string") result.result = { summary: task.result.summary };
  if (task.failure && typeof task.failure.code === "string") result.failure = { code: task.failure.code, message: String(task.failure.message ?? "").slice(0, 500) };
  return result;
}

async function accessIdentity(request, env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const raw = request.headers.get("cf-access-jwt-assertion");
  if (!raw || raw.length > 8_192) return null;
  const [headerPart, payloadPart, signaturePart, extra] = raw.split(".");
  if (!headerPart || !payloadPart || !signaturePart || extra !== undefined) return null;
  try {
    const header = JSON.parse(atob(headerPart.replace(/-/g, "+").replace(/_/g, "/")));
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));
    if (header.alg !== "RS256" || typeof header.kid !== "string") return null;
    const issuer = `https://${env.ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
    const now = Math.floor(Date.now() / 1000);
    const audience = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (payload.iss !== issuer || !audience.includes(env.ACCESS_AUD) ||
        typeof payload.sub !== "string" || payload.sub.length > 255 ||
        !Number.isFinite(payload.exp) || payload.exp <= now ||
        (payload.nbf !== undefined && (!Number.isFinite(payload.nbf) || payload.nbf > now + 60))) return null;
    if (!jwksCache || jwksCache.expiresAt < now) {
      const response = await fetch(`${issuer}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(5_000) });
      if (!response.ok) return null;
      const keys = await response.json();
      if (!Array.isArray(keys.keys)) return null;
      jwksCache = { keys: keys.keys, expiresAt: now + 300 };
    }
    const jwk = jwksCache.keys.find((key) => key.kid === header.kid && key.kty === "RSA");
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const signature = Uint8Array.from(atob(signaturePart.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, encoder.encode(`${headerPart}.${payloadPart}`));
    return valid ? { subject: String(payload.sub), email: typeof payload.email === "string" ? payload.email : undefined } : null;
  } catch {
    return null;
  }
}

async function tokenMatches(actual, expected) {
  if (!actual || !expected || expected.length < 32 || actual.length > 512) return false;
  const [left, right] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(actual)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0 && actual.length === expected.length;
}

function projectsFromEnv(env) {
  try {
    const values = JSON.parse(env.AGENT_PROJECTS ?? "[]");
    return Array.isArray(values) && values.every((value) => typeof value === "string") ? values : [];
  } catch { return []; }
}

async function readJson(request, maximum = 96 * 1_024) {
  const declared = Number(request.headers.get("content-length"));
  if (declared > maximum) return { error: "body_too_large" };
  if (!request.body) return { error: "invalid_json" };
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel();
        return { error: "body_too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { error: "invalid_body" };
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return { value: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) }; }
  catch { return { error: "invalid_json" }; }
}

async function forward(env, pathname, { method = "GET", body, headers = {}, includeOwner = false } = {}) {
  const id = env.HUB.idFromName("agent-hub-v1");
  const stub = env.HUB.get(id);
  const request = new Request(`https://hub.internal${pathname}`, {
    method,
    headers: { ...headers, ...(body === undefined ? {} : { "content-type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const response = await stub.fetch(request);
  const value = await response.json();
  if (!includeOwner && value.task && typeof value.task === "object") delete value.task.owner;
  return json(value, response.status);
}

const controlPlane = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/healthz" && request.method === "GET") return json({ status: "ok" });
    if (url.pathname.startsWith("/v1/dashboard/")) {
      const proxyToken = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
      if (!await tokenMatches(proxyToken, env.AGENT_HUB_DASHBOARD_PROXY_SECRET)) return error("unauthorized", 401);

      if (url.pathname === "/v1/dashboard/session" && request.method === "POST") {
        const parsed = await readJson(request, 2_048);
        if (parsed.error || !parsed.value || typeof parsed.value.password !== "string" || parsed.value.password.length < 1 || parsed.value.password.length > 1_024 || Object.keys(parsed.value).some((key) => key !== "password")) {
          return error("invalid_request", 400);
        }
        const clientIp = request.headers.get("x-dashboard-client-ip")?.slice(0, 128) || "unknown";
        const ipKey = await sha256Hex(`${env.AGENT_HUB_DASHBOARD_PROXY_SECRET}\0${clientIp}`);
        const attempt = await forward(env, "/internal/dashboard/login-attempt", { method: "POST", body: { ipKey } });
        if (attempt.status === 429) return error("rate_limited", 429);
        if (attempt.status !== 200) return error("dashboard_unavailable", 503);
        if (!await verifyDashboardPassword(parsed.value.password, env.AGENT_HUB_ADMIN_PASSWORD_HASH)) return error("unauthorized", 401);

        await forward(env, "/internal/dashboard/login-success", { method: "POST", body: { ipKey } });
        const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
        const token = bytesToBase64Url(tokenBytes);
        const tokenHash = await sha256Hex(token);
        const expiresAt = Date.now() + DASHBOARD_SESSION_MS;
        const saved = await forward(env, "/internal/dashboard/sessions", { method: "POST", body: { tokenHash, expiresAt } });
        if (!saved.ok) return error("dashboard_unavailable", 503);
        return new Response(JSON.stringify({ authenticated: true, expiresAt }), {
          status: 200,
          headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "set-cookie": dashboardCookie(token) },
        });
      }

      const token = sessionToken(request);
      const tokenHash = token ? await sha256Hex(token) : "";
      const sessionResponse = tokenHash ? await forward(env, `/internal/dashboard/sessions/${tokenHash}`) : error("unauthorized", 401);
      const authenticated = sessionResponse.ok;
      const expiresAt = authenticated ? (await sessionResponse.json()).expiresAt : undefined;
      const sessionCookie = dashboardCookie("", 0);

      if (url.pathname === "/v1/dashboard/session" && request.method === "GET") {
        return authenticated ? json({ authenticated: true, expiresAt }) : new Response(JSON.stringify({ error: "unauthorized" }), {
          status: 401, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "set-cookie": sessionCookie },
        });
      }
      if (url.pathname === "/v1/dashboard/session" && request.method === "DELETE") {
        if (tokenHash) await forward(env, `/internal/dashboard/sessions/${tokenHash}`, { method: "DELETE" });
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "set-cookie": sessionCookie },
        });
      }
      if (!authenticated) return error("unauthorized", 401);

      if (url.pathname === "/v1/dashboard/status" && request.method === "GET") {
        if (typeof env.AGENT_ID !== "string" || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(env.AGENT_ID)) return error("dashboard_unavailable", 503);
        const response = await forward(env, `/internal/agents/${env.AGENT_ID}`);
        if (!response.ok) return error("dashboard_unavailable", 503);
        const agent = await response.json();
        return json({ worker: "online", agent: agent.status, lastSeenAt: agent.lastSeenAt ?? null });
      }

      if (url.pathname === "/v1/dashboard/tasks" && request.method === "GET") {
        const projects = projectsFromEnv(env);
        if (!projects.length) return error("dashboard_unavailable", 503);
        const requestedLimit = Number(url.searchParams.get("limit") ?? 50);
        const limit = Number.isInteger(requestedLimit) ? Math.max(1, Math.min(requestedLimit, 100)) : 50;
        const query = new URLSearchParams();
        for (const project of projects) query.append("project", project);
        query.set("limit", String(limit));
        const response = await forward(env, `/internal/dashboard/tasks?${query}`);
        if (!response.ok) return error("dashboard_unavailable", 503);
        const value = await response.json();
        return json({ projects, tasks: value.tasks.map(dashboardTask) });
      }

      if (url.pathname === "/v1/dashboard/tasks" && request.method === "POST") {
        const parsed = await readJson(request);
        if (parsed.error) return error(parsed.error, 400);
        const projects = projectsFromEnv(env);
        const invalid = validateCreateBody(parsed.value, projects);
        if (invalid) return error(invalid, invalid === "project_forbidden" ? 403 : 400);
        const idempotencyKey = request.headers.get("idempotency-key");
        if (idempotencyKey && !/^[a-zA-Z0-9._:-]{8,128}$/.test(idempotencyKey)) return error("invalid_idempotency_key", 400);
        const response = await forward(env, "/internal/tasks", {
          method: "POST",
          body: { ...parsed.value, owner: "dashboard-admin" },
          headers: { "x-idempotency-key": idempotencyKey ?? crypto.randomUUID() },
        });
        const value = await response.json();
        return value.task ? json({ task: dashboardTask(value.task) }, response.status) : json(value, response.status);
      }

      const dashboardTaskPath = url.pathname.match(/^\/v1\/dashboard\/tasks\/([0-9a-f-]{36})$/i);
      if (dashboardTaskPath && request.method === "GET") {
        const response = await forward(env, `/internal/tasks/${dashboardTaskPath[1]}`, { includeOwner: true });
        if (!response.ok) return response;
        const value = await response.json();
        if (!projectsFromEnv(env).includes(value.task.projectId)) return error("task_not_found", 404);
        return json({ task: dashboardTask(value.task) });
      }
      return error("not_found", 404);
    }
    if (url.pathname.startsWith("/v1/agent/")) {
      const bearer = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
      if (!await tokenMatches(bearer, env.AGENT_TOKEN)) return error("unauthorized", 401);
      const projects = projectsFromEnv(env);
      const agentId = env.AGENT_ID;
      if (!agentId || projects.length === 0) return error("agent_not_configured", 503);
      const agentHeaders = { "x-agent-id": agentId };
      if (url.pathname === "/v1/agent/register" && request.method === "POST") {
        const parsed = await readJson(request);
        if (parsed.error) return error(parsed.error, 400);
        const requested = parsed.value?.projects;
        if (!Array.isArray(requested) || requested.length === 0 || requested.some((project) => !projects.includes(project))) return error("project_forbidden", 403);
        const registered = await forward(env, `/internal/agents/${agentId}`, { method: "POST", body: { projects: requested } });
        const registration = await registered.json();
        return json({ ...registration, leaseMs: LEASE_MS, protocolVersion: 1 });
      }
      if (url.pathname === "/v1/agent/health" && request.method === "GET") {
        const response = await forward(env, `/internal/agents/${agentId}`);
        const health = await response.json();
        return json({ ...health, configuredProjects: projects, protocolVersion: 1 });
      }
      if (url.pathname === "/v1/agent/claim" && request.method === "POST") {
        const parsed = await readJson(request);
        if (parsed.error) return error(parsed.error, 400);
        if (!Array.isArray(parsed.value?.projects) || parsed.value.projects.length === 0 ||
            parsed.value.projects.some((project) => !projects.includes(project))) return error("project_forbidden", 403);
        return forward(env, "/internal/claim", { method: "POST", body: { agentId, projects: parsed.value.projects }, headers: agentHeaders });
      }
      const taskAction = url.pathname.match(/^\/v1\/agent\/tasks\/([0-9a-f-]{36})\/(start|heartbeat|complete|fail)$/i);
      if (taskAction && request.method === "POST") {
        const [, taskId, action] = taskAction;
        let body;
        if (["complete", "fail"].includes(action)) {
          const parsed = await readJson(request, 4_096);
          if (parsed.error) return error(parsed.error, 400);
          if (action === "complete") {
            if (!parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value) || parsed.value.exitCode !== 0 ||
                (parsed.value.summary !== undefined && (typeof parsed.value.summary !== "string" || parsed.value.summary.length > 500)) ||
                Object.keys(parsed.value).some((key) => !["exitCode", "summary"].includes(key))) return error("invalid_result", 400);
            body = { exitCode: 0, ...(parsed.value.summary === undefined ? {} : { summary: parsed.value.summary }) };
          } else {
            if (typeof parsed.value?.code !== "string" || !/^[a-z0-9_-]{1,80}$/.test(parsed.value.code) ||
                typeof parsed.value?.message !== "string" || parsed.value.message.length > 500 ||
                Object.keys(parsed.value).some((key) => !["code", "message"].includes(key))) return error("invalid_failure", 400);
            body = { code: parsed.value.code, message: parsed.value.message };
          }
        }
        return forward(env, `/internal/tasks/${taskId}/${action}`, { method: "POST", body, headers: agentHeaders });
      }
      return error("not_found", 404);
    }

    if (url.pathname === "/v1/tasks" && request.method === "POST") {
      const identity = await accessIdentity(request, env);
      if (!identity) return error("unauthorized", 401);
      const parsed = await readJson(request);
      if (parsed.error) return error(parsed.error, 400);
      const projects = projectsFromEnv(env);
      const invalid = validateCreateBody(parsed.value, projects);
      if (invalid) return error(invalid, invalid === "project_forbidden" ? 403 : 400);
      const idem = request.headers.get("idempotency-key");
      if (idem && !/^[a-zA-Z0-9._:-]{8,128}$/.test(idem)) return error("invalid_idempotency_key", 400);
      return forward(env, "/internal/tasks", {
        method: "POST",
        body: { ...parsed.value, owner: identity.subject },
        headers: idem ? { "x-idempotency-key": idem } : {},
      });
    }
    const clientTask = url.pathname.match(/^\/v1\/tasks\/([0-9a-f-]{36})$/i);
    if (clientTask && request.method === "GET") {
      const identity = await accessIdentity(request, env);
      if (!identity) return error("unauthorized", 401);
      const response = await forward(env, `/internal/tasks/${clientTask[1]}`, { includeOwner: true });
      if (!response.ok) return response;
      const result = await response.json();
      if (result.task.owner !== identity.subject) return error("task_not_found", 404);
      delete result.task.owner;
      return json({ task: result.task });
    }
    if (clientTask && request.method === "DELETE") {
      const identity = await accessIdentity(request, env);
      if (!identity) return error("unauthorized", 401);
      return forward(env, `/internal/tasks/${clientTask[1]}/cancel`, {
        method: "POST",
        headers: { "x-task-owner": identity.subject },
      });
    }
    return error("not_found", 404);
  },
};

export default controlPlane;
