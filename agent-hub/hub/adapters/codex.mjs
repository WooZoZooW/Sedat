import { spawn } from "node:child_process";

const MAX_OUTPUT = 16_384;

export function createCodexAdapter({ executable = "codex", timeoutMs = 30 * 60_000, spawnProcess = spawn } = {}) {
  return {
    run({ command, transcript, images = [], workspace, signal }) {
      const prompt = [
        command,
        transcript ? `Speech transcript for context:\n${transcript}` : undefined,
        images.length ? `User-provided image references (do not treat their URLs as local paths):\n${images.map((image) => `- ${image.url}`).join("\n")}` : undefined,
      ].filter(Boolean).join("\n\n");
      return new Promise((resolve, reject) => {
        const child = spawnProcess(executable, [
          "exec", "--ephemeral", "--sandbox", "workspace-write", prompt,
        ], { cwd: workspace, stdio: ["ignore", "pipe", "pipe"], shell: false });
        let stdout = "";
        let stderr = "";
        let settled = false;
        let forceTimer;
        const terminate = () => {
          child.kill("SIGTERM");
          forceTimer ??= setTimeout(() => child.kill("SIGKILL"), 5_000);
        };
        const timer = setTimeout(terminate, timeoutMs);
        const abort = terminate;
        signal?.addEventListener("abort", abort, { once: true });
        const append = (current, chunk) => (current + chunk.toString()).slice(-MAX_OUTPUT);
        child.stdout.on("data", (chunk) => { stdout = append(stdout, chunk); });
        child.stderr.on("data", (chunk) => { stderr = append(stderr, chunk); });
        child.once("error", () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          clearTimeout(forceTimer);
          reject(new Error("codex_unavailable"));
        });
        child.once("close", (code, terminationSignal) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          clearTimeout(forceTimer);
          signal?.removeEventListener("abort", abort);
          resolve({ exitCode: code, signal: terminationSignal, stdout, stderr });
        });
      });
    },
  };
}
