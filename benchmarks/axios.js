import axios from "axios";
import {run} from "./common.js";

await run("axios", axios.get, {responseType: "text"});
