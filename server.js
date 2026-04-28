import {createServer} from "node:net";

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

const responseBuffer = Buffer.concat([
  Buffer.from(
    `HTTP/1.1 200 OK\r\n` +
    `Content-Type: application/json\r\n` +
    `Content-Length: ${body.length}\r\n` +
    `Connection: keep-alive\r\n` +
    `\r\n`,
  ),
  body,
]);

const REQUEST_END = Buffer.from("\r\n\r\n");

const server = createServer(socket => {
  socket.setNoDelay(true);
  let buf = Buffer.alloc(0);
  socket.on("data", chunk => {
    buf = buf.length ? Buffer.concat([buf, chunk]) : chunk;
    let idx;
    while ((idx = buf.indexOf(REQUEST_END)) !== -1) {
      socket.write(responseBuffer);
      buf = buf.subarray(idx + REQUEST_END.length);
    }
  });
  socket.on("error", () => {});
});

server.listen(PORT, "127.0.0.1", () => {
  console.error(`server: ready on http://127.0.0.1:${PORT} (${body.length} bytes/response)`);
});
