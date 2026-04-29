import {Pool} from "undici";
import {run} from "./common.js";

const PORT = Number(process.env.PORT) || 3210;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const pool = new Pool(ORIGIN, {connections: 128});

async function undiciPool(url) {
  const {body} = await pool.request({path: url.slice(ORIGIN.length), method: "GET"});
  await body.text();
}

await run("undici-pool", undiciPool, {responseType: "text"});
