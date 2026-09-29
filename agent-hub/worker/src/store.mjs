import {
  canTransition,
  CREATE_LIMIT,
  CREATE_WINDOW_MS,
  LEASE_MS,
  MAX_ACTIVE_TASKS,
  MAX_ATTEMPTS,
  newTask,
  TERMINAL_RETENTION_MS,
} from "./tasks.mjs";

const readJson = (value) => JSON.parse(value);
const writeJson = (value) => JSON.stringify(value);

export class HubStore {
  constructor(ctx) {
    this.ctx = ctx;
    this.lastPrunedAt = 0;
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      state TEXT NOT NULL,
      project_id TEXT NOT NULL,
      owner TEXT NOT NULL,
      agent_id TEXT,
      lease_until INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      data TEXT NOT NULL
    )`);
    ctx.storage.sql.exec(`CREATE INDEX IF NOT EXISTS tasks_queue_idx ON tasks(state, project_id, created_at)`);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS idempotency (
      owner TEXT NOT NULL,
      request_key TEXT NOT NULL,
      task_id TEXT NOT NULL,
      PRIMARY KEY(owner, request_key)
    )`);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      projects TEXT NOT NULL,
      registered_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    )`);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS creation_limits (
      owner TEXT PRIMARY KEY,
      window_start INTEGER NOT NULL,
      count INTEGER NOT NULL
    )`);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS dashboard_sessions (
      token_hash TEXT PRIMARY KEY,
      expires_at INTEGER NOT NULL
    )`);
    ctx.storage.sql.exec(`CREATE TABLE IF NOT EXISTS dashboard_login_limits (
      ip_key TEXT PRIMARY KEY,
      window_start INTEGER NOT NULL,
      count INTEGER NOT NULL
    )`);
  }

  async fetch(request) {
    let body = {};
    if (request.method === "POST" && request.headers.get("content-type")?.includes("application/json")) {
      try { body = await request.json(); } catch { return Response.json({ error: "invalid_json" }, { status: 400 }); }
    }
    return this.#route(request, body);
  }

  #read(id) {
    const row = this.ctx.storage.sql.exec("SELECT data FROM tasks WHERE id = ?", id).toArray()[0];
    return row ? readJson(row.data) : undefined;
  }

  #save(task) {
    this.ctx.storage.sql.exec(
      `INSERT INTO tasks(id, state, project_id, owner, agent_id, lease_until, created_at, updated_at, data)
       VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET state=excluded.state, project_id=excluded.project_id,
       owner=excluded.owner, agent_id=excluded.agent_id, lease_until=excluded.lease_until,
       updated_at=excluded.updated_at, data=excluded.data`,
      task.id, task.state, task.projectId, task.owner, task.agentId ?? null,
      task.leaseUntil ?? null, task.createdAt, task.updatedAt, writeJson(task),
    );
  }

  #route(request, body) {
    const url = new URL(request.url);
    const now = Date.now();
    try {
      if (request.method === "POST" && url.pathname === "/internal/tasks") {
        return this.ctx.storage.transactionSync(() => {
          const idem = request.headers.get("x-idempotency-key");
          if (idem) {
            const existing = this.ctx.storage.sql.exec(
              "SELECT task_id FROM idempotency WHERE owner = ? AND request_key = ?", body.owner, idem,
            ).toArray()[0];
            if (existing) return Response.json({ task: this.#read(existing.task_id), duplicate: true }, { status: 200 });
          }
          const limit = this.ctx.storage.sql.exec(
            "SELECT window_start, count FROM creation_limits WHERE owner = ?", body.owner,
          ).toArray()[0];
          if (limit && now - limit.window_start < CREATE_WINDOW_MS && limit.count >= CREATE_LIMIT) {
            return Response.json({ error: "rate_limited" }, { status: 429 });
          }
          this.#prune(now);
          const activeCount = this.ctx.storage.sql.exec(
            "SELECT COUNT(*) AS count FROM tasks WHERE state IN ('queued','claimed','running')",
          ).toArray()[0].count;
          if (activeCount >= MAX_ACTIVE_TASKS) return Response.json({ error: "queue_full" }, { status: 429 });
          if (limit && now - limit.window_start < CREATE_WINDOW_MS) {
            this.ctx.storage.sql.exec("UPDATE creation_limits SET count = count + 1 WHERE owner = ?", body.owner);
          } else {
            this.ctx.storage.sql.exec(
              `INSERT INTO creation_limits(owner, window_start, count) VALUES(?, ?, 1)
               ON CONFLICT(owner) DO UPDATE SET window_start=excluded.window_start, count=1`,
              body.owner, now,
            );
          }
          const task = newTask(body, { id: crypto.randomUUID(), owner: body.owner, now });
          this.#save(task);
          if (idem) this.ctx.storage.sql.exec(
            "INSERT INTO idempotency(owner, request_key, task_id) VALUES(?, ?, ?)", body.owner, idem, task.id,
          );
          return Response.json({ task }, { status: 201 });
        });
      }

      if (url.pathname === "/internal/dashboard/login-attempt" && request.method === "POST") {
        const { ipKey } = body;
        if (typeof ipKey !== "string" || !/^[a-f0-9]{64}$/.test(ipKey)) return Response.json({ error: "invalid_request" }, { status: 400 });
        return this.ctx.storage.transactionSync(() => {
          this.ctx.storage.sql.exec("DELETE FROM dashboard_login_limits WHERE window_start < ?", now - 15 * 60 * 1000);
          this.ctx.storage.sql.exec("DELETE FROM dashboard_sessions WHERE expires_at <= ?", now);
          const row = this.ctx.storage.sql.exec("SELECT window_start, count FROM dashboard_login_limits WHERE ip_key = ?", ipKey).toArray()[0];
          if (row && now - row.window_start < 15 * 60 * 1000 && row.count >= 5) return Response.json({ error: "rate_limited" }, { status: 429 });
          if (row && now - row.window_start < 15 * 60 * 1000) {
            this.ctx.storage.sql.exec("UPDATE dashboard_login_limits SET count = count + 1 WHERE ip_key = ?", ipKey);
          } else {
            this.ctx.storage.sql.exec(`INSERT INTO dashboard_login_limits(ip_key, window_start, count) VALUES(?, ?, 1)
              ON CONFLICT(ip_key) DO UPDATE SET window_start=excluded.window_start, count=1`, ipKey, now);
          }
          return Response.json({ allowed: true });
        });
      }
      if (url.pathname === "/internal/dashboard/login-success" && request.method === "POST") {
        if (typeof body.ipKey === "string") this.ctx.storage.sql.exec("DELETE FROM dashboard_login_limits WHERE ip_key = ?", body.ipKey);
        return Response.json({ ok: true });
      }
      if (url.pathname === "/internal/dashboard/sessions" && request.method === "POST") {
        if (typeof body.tokenHash !== "string" || !/^[a-f0-9]{64}$/.test(body.tokenHash) || !Number.isFinite(body.expiresAt)) {
          return Response.json({ error: "invalid_request" }, { status: 400 });
        }
        this.ctx.storage.sql.exec("INSERT INTO dashboard_sessions(token_hash, expires_at) VALUES(?, ?)", body.tokenHash, body.expiresAt);
        return Response.json({ ok: true }, { status: 201 });
      }
      const sessionMatch = url.pathname.match(/^\/internal\/dashboard\/sessions\/([a-f0-9]{64})$/);
      if (sessionMatch && request.method === "GET") {
        const row = this.ctx.storage.sql.exec("SELECT expires_at FROM dashboard_sessions WHERE token_hash = ?", sessionMatch[1]).toArray()[0];
        if (!row || row.expires_at <= now) {
          if (row) this.ctx.storage.sql.exec("DELETE FROM dashboard_sessions WHERE token_hash = ?", sessionMatch[1]);
          return Response.json({ error: "unauthorized" }, { status: 401 });
        }
        return Response.json({ expiresAt: row.expires_at });
      }
      if (sessionMatch && request.method === "DELETE") {
        this.ctx.storage.sql.exec("DELETE FROM dashboard_sessions WHERE token_hash = ?", sessionMatch[1]);
        return Response.json({ ok: true });
      }
      if (url.pathname === "/internal/dashboard/tasks" && request.method === "GET") {
        const projects = url.searchParams.getAll("project");
        const limit = Number(url.searchParams.get("limit") ?? 50);
        if (!projects.length || projects.length > 20 || projects.some((project) => !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(project)) || !Number.isInteger(limit) || limit < 1 || limit > 100) {
          return Response.json({ error: "invalid_request" }, { status: 400 });
        }
        const rows = this.ctx.storage.sql.exec(
          `SELECT data FROM tasks WHERE project_id IN (${projects.map(() => "?").join(",")}) ORDER BY created_at DESC LIMIT ?`,
          ...projects, limit,
        ).toArray();
        return Response.json({ tasks: rows.map((row) => readJson(row.data)) });
      }

      if (request.method === "POST" && url.pathname === "/internal/claim") {
        const { agentId, projects } = body;
        return this.ctx.storage.transactionSync(() => {
          this.#touchAgent(agentId, projects, now);
          if (now - this.lastPrunedAt >= 60_000) {
            this.#prune(now);
            this.lastPrunedAt = now;
          }
          const staleRows = this.ctx.storage.sql.exec(
            "SELECT data FROM tasks WHERE state IN ('claimed','running') AND lease_until <= ?", now,
          ).toArray();
          for (const row of staleRows) {
            const task = readJson(row.data);
            if (task.attempt >= MAX_ATTEMPTS) {
              this.#transition(task, "failed", now, { failure: { code: "lease_expired", message: "Agent lease expired." } });
            } else {
              this.#transition(task, "queued", now, { agentId: undefined, leaseUntil: undefined, startedAt: undefined });
            }
          }
          const rows = this.ctx.storage.sql.exec(
            `SELECT data FROM tasks WHERE state='queued' AND project_id IN (${projects.map(() => "?").join(",")}) ORDER BY created_at LIMIT 1`,
            ...projects,
          ).toArray();
          if (!rows.length) return Response.json({ task: null });
          const task = readJson(rows[0].data);
          this.#transition(task, "claimed", now, {
            agentId,
            attempt: task.attempt + 1,
            leaseUntil: now + LEASE_MS,
          });
          return Response.json({ task });
        });
      }

      const agentMatch = url.pathname.match(/^\/internal\/agents\/([a-z0-9][a-z0-9_-]{0,63})$/);
      if (agentMatch && request.method === "POST") {
        const { projects } = body;
        if (!Array.isArray(projects) || projects.length === 0 || projects.some((project) => typeof project !== "string")) {
          return Response.json({ error: "invalid_projects" }, { status: 400 });
        }
        this.ctx.storage.sql.exec(
          `INSERT INTO agents(id, projects, registered_at, last_seen_at) VALUES(?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET projects=excluded.projects, last_seen_at=excluded.last_seen_at`,
          agentMatch[1], writeJson(projects), now, now,
        );
        return Response.json({ agentId: agentMatch[1], registeredAt: now, lastSeenAt: now });
      }
      if (agentMatch && request.method === "GET") {
        const row = this.ctx.storage.sql.exec(
          "SELECT projects, registered_at, last_seen_at FROM agents WHERE id = ?", agentMatch[1],
        ).toArray()[0];
        if (!row) return Response.json({ status: "unregistered" });
        return Response.json({
          status: now - row.last_seen_at < LEASE_MS ? "online" : "stale",
          agentId: agentMatch[1],
          projects: readJson(row.projects),
          registeredAt: row.registered_at,
          lastSeenAt: row.last_seen_at,
        });
      }

      const match = url.pathname.match(/^\/internal\/tasks\/([0-9a-f-]{36})(?:\/(start|heartbeat|complete|fail|cancel))?$/i);
      if (!match) return Response.json({ error: "not_found" }, { status: 404 });
      const [, id, operation] = match;
      return this.ctx.storage.transactionSync(() => {
        const task = this.#read(id);
        if (!task) return Response.json({ error: "task_not_found" }, { status: 404 });
        if (!operation) return Response.json({ task });
        if (operation === "cancel" && task.owner !== request.headers.get("x-task-owner")) {
          return Response.json({ error: "task_not_found" }, { status: 404 });
        }
        if (["start", "heartbeat", "complete", "fail"].includes(operation) && task.agentId !== request.headers.get("x-agent-id")) {
          return Response.json({ error: "task_not_owned" }, { status: 403 });
        }
        if (operation === "heartbeat") {
          if (!["claimed", "running"].includes(task.state)) return Response.json({ error: "invalid_state" }, { status: 409 });
          if (task.leaseUntil <= now) return Response.json({ error: "lease_expired" }, { status: 409 });
          task.leaseUntil = now + LEASE_MS;
          task.updatedAt = now;
          this.#save(task);
          this.ctx.storage.sql.exec("UPDATE agents SET last_seen_at = ? WHERE id = ?", now, task.agentId);
          return Response.json({ task });
        }
        const transitions = { start: "running", complete: "completed", fail: "failed", cancel: "cancelled" };
        const next = transitions[operation];
        if (task.state === next && operation === "complete") return Response.json({ task, duplicate: true });
        if (!canTransition(task.state, next)) return Response.json({ error: "invalid_state" }, { status: 409 });
        if (["start", "complete", "fail"].includes(operation) && task.leaseUntil <= now) {
          return Response.json({ error: "lease_expired" }, { status: 409 });
        }
        let details = {};
        if (operation === "complete") details.result = body;
        if (operation === "fail") details.failure = body;
        this.#transition(task, next, now, details);
        return Response.json({ task });
      });
    } catch {
      return Response.json({ error: "storage_error" }, { status: 500 });
    }
  }

  #transition(task, next, now, details = {}) {
    task.state = next;
    task.updatedAt = now;
    if (next === "running") task.startedAt = now;
    if (next === "completed") task.completedAt = now;
    if (next === "failed") task.failedAt = now;
    Object.assign(task, details);
    this.#save(task);
  }

  #touchAgent(agentId, projects, now) {
    this.ctx.storage.sql.exec(
      `INSERT INTO agents(id, projects, registered_at, last_seen_at) VALUES(?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET projects=excluded.projects, last_seen_at=excluded.last_seen_at`,
      agentId, writeJson(projects), now, now,
    );
  }

  #prune(now) {
    const cutoff = now - TERMINAL_RETENTION_MS;
    const terminalStates = "'completed','failed','cancelled'";
    this.ctx.storage.sql.exec(
      `DELETE FROM idempotency WHERE task_id IN (
        SELECT id FROM tasks WHERE state IN (${terminalStates}) AND updated_at < ?
      )`, cutoff,
    );
    this.ctx.storage.sql.exec(
      `DELETE FROM tasks WHERE state IN (${terminalStates}) AND updated_at < ?`, cutoff,
    );
    this.ctx.storage.sql.exec("DELETE FROM creation_limits WHERE window_start < ?", now - CREATE_WINDOW_MS);
  }
}
