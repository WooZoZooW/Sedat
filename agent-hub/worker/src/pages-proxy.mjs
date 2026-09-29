const noStoreJson = (value, status) => Response.json(value, {
  status,
  headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
});

function validDashboardPath(path, method) {
  if (path === "session" && ["GET", "POST", "DELETE"].includes(method)) return "session";
  if (path === "status" && method === "GET") return "status";
  if (path === "tasks" && ["GET", "POST"].includes(method)) return "tasks";
  if (/^tasks\/[0-9a-f-]{36}$/i.test(path) && method === "GET") return path;
  return undefined;
}

export async function onRequest(context) {
  const path = context.params.path ?? "";
  const route = validDashboardPath(path, context.request.method);
  if (!route) return noStoreJson({ error: "not_found" }, 404);

  const url = new URL(context.request.url);
  const origin = context.request.headers.get("origin");
  const fetchSite = context.request.headers.get("sec-fetch-site");
  if ((origin && origin !== url.origin) || fetchSite === "cross-site") return noStoreJson({ error: "forbidden" }, 403);

  const workerUrl = context.env.AGENT_HUB_WORKER_URL;
  const proxySecret = context.env.AGENT_HUB_DASHBOARD_PROXY_SECRET;
  if (!workerUrl || !proxySecret || proxySecret.length < 32) return noStoreJson({ error: "unavailable" }, 503);

  let target;
  try {
    target = new URL(workerUrl);
    const local = ["localhost", "127.0.0.1", "::1"].includes(target.hostname);
    if ((target.protocol !== "https:" && !(local && target.protocol === "http:")) || target.username || target.password || target.search || target.hash) {
      return noStoreJson({ error: "unavailable" }, 503);
    }
    target.pathname = `/v1/dashboard/${route}`;
    target.search = route === "tasks" && context.request.method === "GET" ? `?${new URLSearchParams({ limit: url.searchParams.get("limit") ?? "50" })}` : "";
  } catch {
    return noStoreJson({ error: "unavailable" }, 503);
  }

  const headers = new Headers({
    authorization: `Bearer ${proxySecret}`,
    "x-dashboard-client-ip": (context.request.headers.get("cf-connecting-ip") ?? "unknown").slice(0, 128),
  });
  const incomingCookie = context.request.headers.get("cookie") ?? "";
  const dashboardSessionCookie = incomingCookie.split(";").map((item) => item.trim()).find((item) => /^agent_hub_session=[A-Za-z0-9_-]{40,64}$/.test(item));
  if (dashboardSessionCookie) headers.set("cookie", dashboardSessionCookie);
  if (context.request.method === "POST") headers.set("content-type", "application/json");
  const idempotencyKey = context.request.headers.get("idempotency-key");
  if (route === "tasks" && context.request.method === "POST" && idempotencyKey && /^[a-zA-Z0-9._:-]{8,128}$/.test(idempotencyKey)) {
    headers.set("idempotency-key", idempotencyKey);
  }

  let body;
  if (context.request.method === "POST") {
    const declaredSize = Number(context.request.headers.get("content-length") ?? 0);
    if (declaredSize > 96 * 1024) return noStoreJson({ error: "body_too_large" }, 413);
    body = await context.request.text();
    if (body.length > 96 * 1024) return noStoreJson({ error: "body_too_large" }, 413);
  }

  try {
    const upstream = await fetch(target, { method: context.request.method, headers, body, redirect: "manual" });
    if (upstream.status >= 300 && upstream.status < 400) return noStoreJson({ error: "unavailable" }, 503);
    const responseHeaders = new Headers({
      "content-type": upstream.headers.get("content-type") ?? "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
    });
    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) responseHeaders.set("set-cookie", setCookie.replace(/Path=\/v1\/dashboard/i, "Path=/api/agent-hub"));
    return new Response(await upstream.arrayBuffer(), { status: upstream.status, headers: responseHeaders });
  } catch {
    return noStoreJson({ error: "unavailable" }, 503);
  }
}
