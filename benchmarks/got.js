import got from "got";
import {run} from "./common.js";

await run("got", got.get, {responseType: "text"});
