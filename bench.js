import {spawn, spawnSync} from "node:child_process";

const PORT = Number(process.env.PORT) || 3210;

const server = spawn("node", ["server.js"], {
  stdio: "ignore",
  env: {...process.env, PORT: String(PORT)},
});

const deadline = Date.now() + 5000;
while (true) {
  try {
    await fetch(`http://127.0.0.1:${PORT}/`);
    break;
  } catch {
    if (Date.now() > deadline) {
      server.kill("SIGTERM");
      throw new Error("server failed to start within 5s");
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

const benchmarks = [
  ["node", ["benchmarks/nodehttp.js"]],
  ["node", ["benchmarks/nodefetch.js"]],
  ["node", ["benchmarks/undici-fetch.js"]],
  ["node", ["benchmarks/undici-request.js"]],
  ["node", ["benchmarks/undici-pool.js"]],
  ["deno", ["run", "-A", "benchmarks/deno.js"]],
  ["bun", ["run", "benchmarks/bun.js"]],
  ["node", ["benchmarks/ky.js"]],
  ["node", ["benchmarks/ofetch.js"]],
  ["node", ["benchmarks/axios.js"]],
  ["node", ["benchmarks/got.js"]],
];

const rows = [];
try {
  for (const [cmd, args] of benchmarks) {
    const result = spawnSync(cmd, args, {
      encoding: "utf8",
      env: {...process.env, PORT: String(PORT)},
    });
    if (result.status !== 0) {
      throw new Error(`${cmd} ${args.join(" ")} failed:\n${result.stderr}`);
    }
    rows.push(result.stdout.trim().split("\n").pop().split("\t"));
  }
} finally {
  server.kill("SIGTERM");
}

const headers = ["client", "median", "min", "max", "user", "sys"];
const widths = headers.map((header, idx) => Math.max(header.length, ...rows.map(row => row[idx].length)));
const fmt = row => row.map((cell, idx) => idx === 0 ? cell.padEnd(widths[idx]) : cell.padStart(widths[idx])).join("  ");

console.info(fmt(headers));
console.info(widths.map(width => "-".repeat(width)).join("  "));
for (const row of rows) console.info(fmt(row));
