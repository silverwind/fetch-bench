import {createServer} from "node:http";

const PORT = Number(process.env.PORT) || 3210;

const body = Buffer.from(JSON.stringify({
  name: "fake-pkg",
  description: "x".repeat(200),
  versions: Object.fromEntries(Array.from({length: 80}, (_, idx) => [
    `1.0.${idx}`,
    {
      name: "fake-pkg",
      version: `1.0.${idx}`,
      description: "y".repeat(120),
      main: "index.js",
      dependencies: Object.fromEntries(Array.from({length: 8}, (_, jdx) => [`dep-${jdx}`, "^1.0.0"])),
    },
  ])),
}));

const headers = {
  "content-type": "application/json",
  "content-length": body.length,
};

const server = createServer((_, res) => {
  res.writeHead(200, headers);
  res.end(body);
});

server.listen(PORT, "127.0.0.1", () => {
  console.error(`server: ready on http://127.0.0.1:${PORT} (${body.length} bytes/response)`);
});
