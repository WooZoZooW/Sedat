import { pbkdf2Sync, randomBytes } from "node:crypto";
import { emitKeypressEvents } from "node:readline";

if (!process.stdin.isTTY || !process.stdin.setRawMode) {
  throw new Error("Run this utility in an interactive terminal.");
}

const chunks = [];
process.stdin.setRawMode(true);
process.stdin.resume();
emitKeypressEvents(process.stdin);
process.stderr.write("Enter the Agent Hub dashboard password (input hidden): ");

try {
  await new Promise((resolve, reject) => {
    process.stdin.on("keypress", (character, key = {}) => {
      if (key.ctrl && key.name === "c") return reject(new Error("Cancelled."));
      if (key.name === "return" || key.name === "enter") return resolve();
      if (key.name === "backspace") { chunks.pop(); return; }
      if (!key.ctrl && !key.meta && character) chunks.push(character);
    });
  });
} finally {
  process.stdin.setRawMode(false);
  process.stdin.pause();
  process.stderr.write("\n");
}

const password = chunks.join("");
chunks.fill("");
if (password.length < 14 || password.length > 1_024) {
  throw new Error("Use a password between 14 and 1024 characters.");
}

const iterations = 310_000;
const salt = randomBytes(24);
const derived = pbkdf2Sync(password, salt, iterations, 32, "sha256");
const encode = (bytes) => bytes.toString("base64url");
process.stdout.write(`pbkdf2-sha256$${iterations}$${encode(salt)}$${encode(derived)}\n`);
