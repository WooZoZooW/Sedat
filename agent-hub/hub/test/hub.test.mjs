import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { createCodexAdapter } from "../adapters/codex.mjs";
import { createHub, loadConfig } from "../hub.mjs";

test("local project IDs resolve only through trusted absolute workspace configuration", async () => {
  const directory = await mkdtemp(join(tmpdir(), "agent-hub-config-"));
  try {
    const workspace = join(directory, "workspace");
    await mkdir(workspace);
    const configPath = join(directory, "agent-hub.json");
    await writeFile(configPath, JSON.stringify({ apiUrl: "https://control.example", projects: { site: workspace } }));
    const config = await loadConfig(configPath);
    assert.equal(config.projects.site, workspace);

    await writeFile(configPath, JSON.stringify({ apiUrl: "https://control.example", projects: { site: "../../" } }));
    await assert.rejects(loadConfig(configPath), /absolute workspace paths/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Codex adapter uses a fixed executable, argv, workspace cwd, and no shell", async () => {
  let invocation;
  const adapter = createCodexAdapter({
    executable: "/trusted/bin/codex",
    spawnProcess: (executable, args, options) => {
      invocation = { executable, args, options };
      const child = new EventEmitter();
      child.stdout = new PassThrough();
      child.stderr = new PassThrough();
      queueMicrotask(() => child.emit("close", 0, null));
      child.kill = () => true;
      return child;
    },
  });
  const result = await adapter.run({
    command: "Make the heading blue.",
    transcript: "Make the heading blue, please.",
    images: [{ url: "https://images.example.test/design.png" }],
    workspace: "/trusted/workspace",
    signal: new AbortController().signal,
  });
  assert.equal(result.exitCode, 0);
  assert.equal(invocation.executable, "/trusted/bin/codex");
  assert.deepEqual(invocation.args.slice(0, 4), ["exec", "--ephemeral", "--sandbox", "workspace-write"]);
  assert.match(invocation.args[4], /Make the heading blue/);
  assert.match(invocation.args[4], /Make the heading blue, please/);
  assert.match(invocation.args[4], /https:\/\/images\.example\.test\/design\.png/);
  assert.equal(invocation.options.cwd, "/trusted/workspace");
  assert.equal(invocation.options.shell, false);
});

test("Agent Hub refuses a missing or short workstation credential", () => {
  assert.throws(() => createHub({ config: {}, token: "short", adapter: {} }), /at least 32 characters/);
});
