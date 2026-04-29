import {request} from "node:http";
import {run} from "./common.js";

function nodeHttp(url) {
  return new Promise((resolve, reject) => {
    const req = request(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", chunk => {
        body += chunk;
      });
      res.on("end", () => resolve(body));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.end();
  });
}

await run("node:http", nodeHttp, {responseType: "text"});
