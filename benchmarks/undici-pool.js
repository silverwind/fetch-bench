import {Pool} from "undici";
import {ORIGIN, run} from "./common.js";

const pool = new Pool(ORIGIN, {connections: 128});

async function undiciPool(url) {
  const {body} = await pool.request({path: url.slice(ORIGIN.length), method: "GET"});
  await body.text();
}

await run("undici-pool", undiciPool, {responseType: "text"});
