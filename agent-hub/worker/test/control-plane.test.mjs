import test, { before, beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { generateKeyPairSync, pbkdf2Sync, randomBytes, sign } from "node:crypto";
import worker, { HubStore } from "../src/index.mjs";
import { createHub } from "../../hub/hub.mjs";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: "jwk" }), kid: "unit-test-key", alg: "RS256", use: "sig" };
const team = "test-team.cloudflareaccess.com";
const audience = "test-audience";
const dashboardPassword = "test-only dashboard password";
const dashboardSalt = Buffer.from("dashboard-test-salt-24-bytes!!");
const dashboardHash = `pbkdf2-sha256$100000$${dashboardSalt.toString("base64url")}$${pbkdf2Sync(dashboardPassword, dashboardSalt, 100000, 32, "sha256").toString("base64url")}`;
let db;
let store;
let env;
let originalFetch;

function b64(value) { return Buffer.from(value).toString("base64url"); }
function accessToken(subject) {
  const head = b64(JSON.stringify({ alg: "RS256", kid: jwk.kid, typ: "JWT" }));
  const payload = b64(JSON.stringify({ iss: `https://${team}`, aud: audience, sub: subject, exp: Math.floor(Date.now() / 1000) + 300 }));
  const content = `${head}.${payload}`;
  return `${content}.${sign("RSA-SHA256", Buffer.from(content), privateKey).toString("base64url")}`;
}

function responseRows(sql, params) {
  const query = sql.trim();
  if (/^SELECT/i.test(query)) return db.prepare(query).all(...params);
  db.prepare(query).run(...params);
  return [];
}

function setup() {
  db = new DatabaseSync(":memory:");
  const storage = {
    sql: { exec: (sql, ...params) => {
      const rows = responseRows(sql, params);
      return { toArray: () => rows };
    } },
    transactionSync: (callback) => {
      db.exec("BEGIN IMMEDIATE");
      try { const result = callback(); db.exec("COMMIT"); return result; }
      catch (cause) { db.exec("ROLLBACK"); throw cause; }
    },
  };
  store = new HubStore({ storage });
  const namespace = { idFromName: (name) => name, get: () => ({ fetch: (request) => store.fetch(request) }) };
  env = {
    HUB: namespace,
    ACCESS_TEAM_DOMAIN: team,
    ACCESS_AUD: audience,
    AGENT_ID: "workstation-1",
    AGENT_TOKEN: randomBytes(32).toString("base64url"),
    AGENT_HUB_DASHBOARD_PROXY_SECRET: randomBytes(32).toString("base64url"),
    AGENT_HUB_ADMIN_PASSWORD_HASH: dashboardHash,
    AGENT_PROJECTS: '["sedat-site"]',
  };
}

function expireLease(id) {
  const row = db.prepare("SELECT data FROM tasks WHERE id = ?").get(id);
  const task = JSON.parse(row.data);
  task.leaseUntil = 1;
  db.prepare("UPDATE tasks SET lease_until = 1, data = ? WHERE id = ?").run(JSON.stringify(task), id);
}

async function call(path, { method = "GET", body, subject, token, agent = true, dashboard = false, headers = {} } = {}) {
  const requestHeaders = new Headers(headers);
  if (body !== undefined) requestHeaders.set("content-type", "application/json");
  if (subject) requestHeaders.set("cf-access-jwt-assertion", accessToken(subject));
  if (dashboard) {
    requestHeaders.set("authorization", `Bearer ${env.AGENT_HUB_DASHBOARD_PROXY_SECRET}`);
    if (!requestHeaders.has("x-dashboard-client-ip")) requestHeaders.set("x-dashboard-client-ip", "192.0.2.10");
  } else if (token) requestHeaders.set("authorization", `Bearer ${token}`);
  else if (agent) requestHeaders.set("authorization", `Bearer ${env.AGENT_TOKEN}`);
  const request = new Request(`https://control.example${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const response = await worker.fetch(request, env);
  return { response, value: await response.json() };
}

before(() => {
  originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith("/cdn-cgi/access/certs")) {
      return Response.json({ keys: [jwk] });
    }
    return originalFetch(input, init);
  };
});

beforeEach(() => {
  db?.close();
  setup();
});

after(() => {
  db?.close();
  globalThis.fetch = originalFetch;
});

test("authenticated API enforces task input and ownership", async () => {
  const unauthorized = await call("/v1/tasks", { method: "POST", body: { projectId: "sedat-site", command: "safe" }, agent: false });
  assert.equal(unauthorized.response.status, 401);

  const malformed = await call("/v1/tasks", { method: "POST", subject: "user-a", body: { projectId: "../tmp", command: "safe" }, agent: false });
  assert.equal(malformed.response.status, 400);

  const forbidden = await call("/v1/tasks", { method: "POST", subject: "user-a", body: { projectId: "other", command: "safe" }, agent: false });
  assert.equal(forbidden.response.status, 403);
  const invalidImage = await call("/v1/tasks", {
    method: "POST", subject: "user-a", agent: false,
    body: { projectId: "sedat-site", command: "safe", images: [{ url: "https://user:password@example.com/image.png" }] },
  });
  assert.equal(invalidImage.response.status, 400);

  const created = await call("/v1/tasks", {
    method: "POST", subject: "user-a", agent: false, headers: { "idempotency-key": "request-0001" },
    body: { projectId: "sedat-site", command: "Change the page heading." },
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.value.task.state, "queued");
  const duplicate = await call("/v1/tasks", {
    method: "POST", subject: "user-a", agent: false, headers: { "idempotency-key": "request-0001" },
    body: { projectId: "sedat-site", command: "Different retry body." },
  });
  assert.equal(duplicate.response.status, 200);
  assert.equal(duplicate.value.task.id, created.value.task.id);

  for (let index = 0; index < 9; index++) {
    const next = await call("/v1/tasks", {
      method: "POST", subject: "user-a", agent: false,
      body: { projectId: "sedat-site", command: `Rate limit task ${index}.` },
    });
    assert.equal(next.response.status, 201);
  }
  const rateLimited = await call("/v1/tasks", {
    method: "POST", subject: "user-a", agent: false,
    body: { projectId: "sedat-site", command: "Exceed the per-user limit." },
  });
  assert.equal(rateLimited.response.status, 429);
  const retriedDuplicate = await call("/v1/tasks", {
    method: "POST", subject: "user-a", agent: false, headers: { "idempotency-key": "request-0001" },
    body: { projectId: "sedat-site", command: "Different retry body." },
  });
  assert.equal(retriedDuplicate.value.task.id, created.value.task.id);

  const hidden = await call(`/v1/tasks/${created.value.task.id}`, { subject: "user-b", agent: false });
  assert.equal(hidden.response.status, 404);
  const visible = await call(`/v1/tasks/${created.value.task.id}`, { subject: "user-a", agent: false });
  assert.equal(visible.value.task.id, created.value.task.id);
});

test("dashboard is password protected, uses revocable server sessions, and exposes only scoped task operations", async () => {
  const noProxy = await call("/v1/dashboard/tasks", { agent: false });
  assert.equal(noProxy.response.status, 401);
  const noSession = await call("/v1/dashboard/tasks", { dashboard: true, agent: false });
  assert.equal(noSession.response.status, 401);
  const noStatusSession = await call("/v1/dashboard/status", { dashboard: true, agent: false });
  assert.equal(noStatusSession.response.status, 401);

  const wrongPassword = await call("/v1/dashboard/session", {
    method: "POST", body: { password: "incorrect test password" }, dashboard: true, agent: false,
  });
  assert.equal(wrongPassword.response.status, 401);
  assert.equal(wrongPassword.response.headers.get("set-cookie"), null);

  const signedIn = await call("/v1/dashboard/session", {
    method: "POST", body: { password: dashboardPassword }, dashboard: true, agent: false,
    headers: { cookie: `agent_hub_session=${"A".repeat(43)}` },
  });
  assert.equal(signedIn.response.status, 200);
  assert.deepEqual(signedIn.value.authenticated, true);
  const setCookie = signedIn.response.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Strict/);
  assert.match(setCookie, /Path=\/v1\/dashboard/);
  const cookie = setCookie.split(";", 1)[0];
  assert.notEqual(cookie, `agent_hub_session=${"A".repeat(43)}`);
  assert.equal(JSON.stringify(signedIn.value).includes(dashboardPassword), false);
  assert.equal(JSON.stringify(signedIn.value).includes(env.AGENT_HUB_DASHBOARD_PROXY_SECRET), false);
  assert.equal(JSON.stringify(signedIn.value).includes(dashboardHash), false);

  const session = await call("/v1/dashboard/session", { dashboard: true, agent: false, headers: { cookie } });
  assert.equal(session.response.status, 200);
  assert.equal(session.value.authenticated, true);
  assert.equal(Object.hasOwn(session.value, "token"), false);

  const statusBeforeRegistration = await call("/v1/dashboard/status", { dashboard: true, agent: false, headers: { cookie } });
  assert.equal(statusBeforeRegistration.value.worker, "online");
  assert.equal(statusBeforeRegistration.value.agent, "unregistered");
  await call("/v1/agent/register", { method: "POST", body: { projects: ["sedat-site"] } });
  const status = await call("/v1/dashboard/status", { dashboard: true, agent: false, headers: { cookie } });
  assert.equal(status.value.agent, "online");

  const created = await call("/v1/dashboard/tasks", {
    method: "POST", body: { projectId: "sedat-site", command: "Dashboard task request." }, dashboard: true, agent: false,
    headers: { cookie, "idempotency-key": "dashboard-request-0001" },
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.value.task.state, "queued");
  assert.equal(Object.hasOwn(created.value.task, "owner"), false);
  const duplicateCreate = await call("/v1/dashboard/tasks", {
    method: "POST", body: { projectId: "sedat-site", command: "Dashboard task request." }, dashboard: true, agent: false,
    headers: { cookie, "idempotency-key": "dashboard-request-0001" },
  });
  assert.equal(duplicateCreate.response.status, 200);
  assert.equal(duplicateCreate.value.task.id, created.value.task.id);
  const listed = await call("/v1/dashboard/tasks?limit=100", { dashboard: true, agent: false, headers: { cookie } });
  assert.equal(listed.value.tasks.length, 1);
  assert.equal(listed.value.tasks[0].command, "Dashboard task request.");
  const detail = await call(`/v1/dashboard/tasks/${created.value.task.id}`, { dashboard: true, agent: false, headers: { cookie } });
  assert.equal(detail.response.status, 200);
  assert.equal(detail.value.task.id, created.value.task.id);
  assert.equal(Object.hasOwn(detail.value.task, "owner"), false);

  const loggedOut = await call("/v1/dashboard/session", { method: "DELETE", dashboard: true, agent: false, headers: { cookie } });
  assert.equal(loggedOut.response.status, 200);
  assert.match(loggedOut.response.headers.get("set-cookie"), /Max-Age=0/);
  const invalidated = await call("/v1/dashboard/session", { dashboard: true, agent: false, headers: { cookie } });
  assert.equal(invalidated.response.status, 401);
  const directAgentRoute = await call("/v1/agent/health", { agent: false });
  assert.equal(directAgentRoute.response.status, 401);
});

test("dashboard login rate limits repeated failures and expires server-side sessions", async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const rejected = await call("/v1/dashboard/session", {
      method: "POST", body: { password: "wrong password" }, dashboard: true, agent: false,
    });
    assert.equal(rejected.response.status, 401);
  }
  const limited = await call("/v1/dashboard/session", {
    method: "POST", body: { password: dashboardPassword }, dashboard: true, agent: false,
  });
  assert.equal(limited.response.status, 429);

  const anotherIp = await call("/v1/dashboard/session", {
    method: "POST", body: { password: dashboardPassword }, dashboard: true, agent: false,
    headers: { "x-dashboard-client-ip": "192.0.2.11" },
  });
  assert.equal(anotherIp.response.status, 200);
  const cookie = anotherIp.response.headers.get("set-cookie").split(";", 1)[0];
  db.prepare("UPDATE dashboard_sessions SET expires_at = 1").run();
  const expired = await call("/v1/dashboard/session", { dashboard: true, agent: false, headers: { cookie } });
  assert.equal(expired.response.status, 401);
});

test("agent lifecycle claims once, renews lease, and completes idempotently", async () => {
  const created = await call("/v1/tasks", { method: "POST", subject: "user-a", agent: false, body: { projectId: "sedat-site", command: "Safe test task." } });
  const badCredential = await call("/v1/agent/health", { token: "bad", agent: false });
  assert.equal(badCredential.response.status, 401);
  const registration = await call("/v1/agent/register", { method: "POST", body: { projects: ["other"] } });
  assert.equal(registration.response.status, 403);
  const registered = await call("/v1/agent/register", { method: "POST", body: { projects: ["sedat-site"] } });
  assert.equal(registered.value.agentId, env.AGENT_ID);
  const health = await call("/v1/agent/health");
  assert.equal(health.value.status, "online");
  assert.equal(health.value.projects[0], "sedat-site");

  const claims = await Promise.all([
    call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } }),
    call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } }),
  ]);
  const claimed = claims.filter(({ value }) => value.task);
  assert.equal(claimed.length, 1);
  const id = created.value.task.id;
  const notOwner = await store.fetch(new Request(`https://hub.internal/internal/tasks/${id}/complete`, {
    method: "POST", headers: { "content-type": "application/json", "x-agent-id": "spoofed-agent" }, body: "{}",
  }));
  assert.equal(notOwner.status, 403);
  const started = await call(`/v1/agent/tasks/${id}/start`, { method: "POST" });
  assert.equal(started.value.task.state, "running");
  const heartbeat = await call(`/v1/agent/tasks/${id}/heartbeat`, { method: "POST" });
  assert.ok(heartbeat.value.task.leaseUntil > started.value.task.leaseUntil);
  const completed = await call(`/v1/agent/tasks/${id}/complete`, { method: "POST", body: { exitCode: 0 } });
  assert.equal(completed.value.task.state, "completed");
  const duplicate = await call(`/v1/agent/tasks/${id}/complete`, { method: "POST", body: { exitCode: 0 } });
  assert.equal(duplicate.value.duplicate, true);
  assert.equal((await call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } })).value.task, null);
});

test("failure, stale lease recovery, invalid transitions, and cancellation are enforced", async () => {
  const first = await call("/v1/tasks", { method: "POST", subject: "owner-a", agent: false, body: { projectId: "sedat-site", command: "Fail safely." } });
  const claim = await call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } });
  await call(`/v1/agent/tasks/${claim.value.task.id}/start`, { method: "POST" });
  const fail = await call(`/v1/agent/tasks/${claim.value.task.id}/fail`, { method: "POST", body: { code: "agent_execution_failed", message: "safe failure" } });
  assert.equal(fail.value.task.state, "failed");
  assert.equal((await call(`/v1/agent/tasks/${first.value.task.id}/start`, { method: "POST" })).response.status, 409);

  const stale = await call("/v1/tasks", { method: "POST", subject: "owner-a", agent: false, body: { projectId: "sedat-site", command: "Recover lease." } });
  const staleClaim = await call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } });
  expireLease(stale.value.task.id);
  const lateHeartbeat = await call(`/v1/agent/tasks/${stale.value.task.id}/heartbeat`, { method: "POST" });
  assert.equal(lateHeartbeat.response.status, 409);
  assert.equal(lateHeartbeat.value.error, "lease_expired");
  const recovered = await call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } });
  assert.equal(recovered.value.task.id, stale.value.task.id);
  assert.equal(recovered.value.task.attempt, staleClaim.value.task.attempt + 1);

  const forbiddenCancel = await call(`/v1/tasks/${stale.value.task.id}`, { method: "DELETE", subject: "someone-else", agent: false });
  assert.equal(forbiddenCancel.response.status, 404);
  const cancel = await call(`/v1/tasks/${stale.value.task.id}`, { method: "DELETE", subject: "owner-a", agent: false });
  assert.equal(cancel.value.task.state, "cancelled");
  const claimAfterCancel = await call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } });
  assert.equal(claimAfterCancel.value.task, null);

  const retryTask = await call("/v1/tasks", { method: "POST", subject: "owner-a", agent: false, body: { projectId: "sedat-site", command: "Retry lease test." } });
  let retryClaim = await call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } });
  assert.equal(retryClaim.value.task.attempt, 1);
  for (let attempt = 1; attempt <= 3; attempt++) {
    expireLease(retryTask.value.task.id);
    retryClaim = await call("/v1/agent/claim", { method: "POST", body: { projects: ["sedat-site"] } });
    if (attempt < 3) assert.equal(retryClaim.value.task.attempt, attempt + 1);
    else assert.equal(retryClaim.value.task, null);
  }
  const exhausted = await call(`/v1/tasks/${retryTask.value.task.id}`, { subject: "owner-a", agent: false });
  assert.equal(exhausted.value.task.state, "failed");
  assert.equal(exhausted.value.task.failure.code, "lease_expired");

});

test("end-to-end task passes through Worker, Agent Hub, adapter boundary, and final status", async () => {
  const created = await call("/v1/tasks", {
    method: "POST", subject: "e2e-user", agent: false,
    body: {
      projectId: "sedat-site",
      command: "Safe non-destructive verification request.",
      transcript: "Spoken request transcript.",
      images: [{ url: "https://images.example.test/reference.png", contentType: "image/png" }],
    },
  });
  const adapterCalls = [];
  const hub = createHub({
    config: { apiUrl: "https://control.example", projects: { "sedat-site": "/trusted/test-workspace" }, pollIntervalMs: 10 },
    token: env.AGENT_TOKEN,
    fetchImpl: (input, init) => worker.fetch(new Request(input, init), env),
    adapter: { run: async (task) => { adapterCalls.push(task); return { exitCode: 0, stdout: "", stderr: "" }; } },
    logger: { error() {} },
  });
  const runningHub = hub.run();
  let final;
  for (let attempt = 0; attempt < 50; attempt++) {
    final = await call(`/v1/tasks/${created.value.task.id}`, { subject: "e2e-user", agent: false });
    if (final.value.task.state === "completed") break;
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  hub.stop();
  await runningHub;
  assert.equal(final.value.task.state, "completed");
  assert.equal(adapterCalls.length, 1);
  assert.equal(adapterCalls[0].workspace, "/trusted/test-workspace");
  assert.equal(adapterCalls[0].transcript, "Spoken request transcript.");
  assert.equal(adapterCalls[0].images[0].url, "https://images.example.test/reference.png");
});
