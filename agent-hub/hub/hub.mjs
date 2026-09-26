#!/usr/bin/env node
import { readFile, realpath, stat } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";
import { createCodexAdapter } from "./adapters/codex.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadConfig(configPath) {
  const resolvedConfig = await realpath(configPath);
  const config = JSON.parse(await readFile(resolvedConfig, "utf8"));
  if (typeof config.apiUrl !== "string" || !config.apiUrl.startsWith("https://")) {
    throw new Error("apiUrl must use HTTPS");
  }
  if (!config.projects || typeof config.projects !== "object" || Array.isArray(config.projects)) {
    throw new Error("projects must map project IDs to trusted workspace paths");
  }
  const projects = {};
  for (const [id, path] of Object.entries(config.projects)) {
    if (!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(id) || typeof path !== "string" || !isAbsolute(path)) {
      throw new Error("project IDs and absolute workspace paths are required");
    }
    const workspace = await realpath(path);
    if (!(await stat(workspace)).isDirectory()) throw new Error("workspace paths must resolve to directories");
    projects[id] = workspace;
  }
  if (!Object.keys(projects).length) throw new Error("at least one project must be configured");
  if (!Number.isInteger(config.pollIntervalMs ?? 3000) || (config.pollIntervalMs ?? 3000) < 1000) {
    throw new Error("pollIntervalMs must be at least 1000");
  }
  return { ...config, projects, pollIntervalMs: config.pollIntervalMs ?? 3000 };
}

export function createHub({ config, token, adapter, fetchImpl = fetch, logger = console }) {
  if (!token || token.length < 32) throw new Error("AGENT_TOKEN must contain at least 32 characters");
  let stopping = false;
  let activeController;
  const request = async (path, method = "GET", body) => {
    const response = await fetchImpl(new URL(path, config.apiUrl), {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    const value = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(typeof value.error === "string" ? value.error : `http_${response.status}`);
    return value;
  };

  async function processTask(task) {
    const workspace = config.projects[task.projectId];
    if (!workspace || typeof task.command !== "string") {
      await request(`/v1/agent/tasks/${task.id}/fail`, "POST", { code: "invalid_task", message: "Task project is not configured." });
      return;
    }
    await request(`/v1/agent/tasks/${task.id}/start`, "POST");
    activeController = new AbortController();
    let heartbeatBusy = false;
    const heartbeat = setInterval(async () => {
      if (heartbeatBusy || stopping) return;
      heartbeatBusy = true;
      try { await request(`/v1/agent/tasks/${task.id}/heartbeat`, "POST"); }
      catch { activeController?.abort(); }
      finally { heartbeatBusy = false; }
    }, 20_000);
    try {
      const result = await adapter.run({
        command: task.command,
        transcript: task.transcript,
        images: task.images ?? [],
        metadata: task.metadata ?? {},
        workspace,
        signal: activeController.signal,
      });
      clearInterval(heartbeat);
      if (result.exitCode === 0) {
        await request(`/v1/agent/tasks/${task.id}/complete`, "POST", { exitCode: 0 });
      } else {
        await request(`/v1/agent/tasks/${task.id}/fail`, "POST", {
          code: "agent_execution_failed",
          message: "The coding agent could not complete this request.",
        });
      }
    } catch {
      clearInterval(heartbeat);
      try {
        await request(`/v1/agent/tasks/${task.id}/fail`, "POST", {
          code: "agent_execution_failed",
          message: "The coding agent could not complete this request.",
        });
      } catch { /* The lease will expire and the Worker will safely requeue the task. */ }
    } finally {
      clearInterval(heartbeat);
      activeController = undefined;
    }
  }

  return {
    stop() { stopping = true; activeController?.abort(); },
    async run() {
      await request("/v1/agent/register", "POST", { projects: Object.keys(config.projects) });
      while (!stopping) {
        try {
          const response = await request("/v1/agent/claim", "POST", { projects: Object.keys(config.projects) });
          if (response.task) await processTask(response.task);
          else await sleep(config.pollIntervalMs);
        } catch (cause) {
          logger.error(`Agent Hub request failed (${cause instanceof Error ? cause.message : "unknown_error"}); retrying.`);
          await sleep(Math.min(config.pollIntervalMs * 2, 30_000));
        }
      }
    },
  };
}

async function main() {
  const configPath = process.argv[2] ?? "agent-hub.config.json";
  const config = await loadConfig(configPath);
  const hub = createHub({ config, token: process.env.AGENT_TOKEN, adapter: createCodexAdapter({ executable: process.env.CODEX_BIN ?? "codex" }) });
  process.once("SIGINT", () => hub.stop());
  process.once("SIGTERM", () => hub.stop());
  await hub.run();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((cause) => {
    console.error(`Agent Hub stopped: ${cause instanceof Error ? cause.message : "configuration_error"}`);
    process.exitCode = 1;
  });
}
