import {ofetch} from "ofetch";
import {run} from "./common.js";

await run("ofetch", ofetch, {responseType: "text"});
