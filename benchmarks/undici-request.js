import {request} from "undici";
import {run} from "./common.js";

async function undiciRequest(url) {
  const {body} = await request(url);
  await body.text();
}

await run("undici-request", undiciRequest, {responseType: "text"});
