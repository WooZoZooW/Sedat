import test from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "../src/pages-proxy.mjs";

const env = {
  AGENT_HUB_WORKER_URL: "https://agent-hub.example.workers.dev",
  AGENT_HUB_DASHBOARD_PROXY_SECRET: "test-only-proxy-secret-that-is-32-bytes-long",
};

test("Pages proxy only forwards allowlisted same-origin dashboard routes and scopes session cookies", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ url: new URL(input), init });
    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: { "set-cookie": "agent_hub_session=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; Path=/v1/dashboard; Max-Age=28800; HttpOnly; Secure; SameSite=Strict" },
    });
  };
  try {
    const request = new Request("https://sedat.example/api/agent-hub/tasks?limit=75", {
      headers: {
        origin: "https://sedat.example",
        cookie: "theme=dark; agent_hub_session=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA; unrelated=private",
        "cf-connecting-ip": "192.0.2.44",
      },
    });
    const response = await onRequest({ request, env, params: { path: "tasks" } });
    assert.equal(response.status, 200);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url.href, "https://agent-hub.example.workers.dev/v1/dashboard/tasks?limit=75");
    assert.equal(calls[0].init.headers.get("authorization"), `Bearer ${env.AGENT_HUB_DASHBOARD_PROXY_SECRET}`);
    assert.equal(calls[0].init.headers.get("cookie"), "agent_hub_session=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    assert.equal(calls[0].init.headers.get("x-dashboard-client-ip"), "192.0.2.44");
    assert.equal(response.headers.get("set-cookie").includes("Path=/api/agent-hub"), true);
    assert.equal((await response.text()).includes(env.AGENT_HUB_DASHBOARD_PROXY_SECRET), false);

    const unknownRoute = await onRequest({ request, env, params: { path: "../v1/agent/health" } });
    assert.equal(unknownRoute.status, 404);
    const crossOrigin = new Request("https://sedat.example/api/agent-hub/tasks", {
      method: "POST", headers: { origin: "https://attacker.example", "content-type": "application/json" }, body: "{}",
    });
    const rejectedOrigin = await onRequest({ request: crossOrigin, env, params: { path: "tasks" } });
    assert.equal(rejectedOrigin.status, 403);
    assert.equal(calls.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Pages proxy rejects unsafe Worker origins and does not follow upstream redirects", async () => {
  const request = new Request("https://sedat.example/api/agent-hub/status", { headers: { origin: "https://sedat.example" } });
  const unsafe = await onRequest({ request, env: { ...env, AGENT_HUB_WORKER_URL: "https://user:secret@worker.example" }, params: { path: "status" } });
  assert.equal(unsafe.status, 503);

  const originalFetch = globalThis.fetch;
  let called = 0;
  globalThis.fetch = async (_input, init) => {
    called++;
    assert.equal(init.redirect, "manual");
    return new Response(null, { status: 302, headers: { location: "https://attacker.example/" } });
  };
  try {
    const redirected = await onRequest({ request, env, params: { path: "status" } });
    assert.equal(redirected.status, 503);
    assert.deepEqual(await redirected.json(), { error: "unavailable" });
    assert.equal(called, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
