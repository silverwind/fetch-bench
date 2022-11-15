import nodeFetch from "node-fetch";
import {fetch as undiciFetch, Agent as UndiciAgent} from "undici";
import {Agent as HttpsAgent} from "https";
import pkg from "./1500-deps.json" assert {type: "json"};
import axios from "axios";

const urls = Object.keys(pkg.devDependencies).map(name => `https://registry.npmjs.org/${name.replace(/\//g, "%2f")}`);
const warmupUrls = urls.slice(0, 10);

const dispatcher = new UndiciAgent({connections: 96, pipelining: 1});
const agent = new HttpsAgent({maxSockets: 96, keepAlive: true});
const httpsAgent = new HttpsAgent({maxSockets: 96, keepAlive: true});

// warm up the JIT
await Promise.all([
  ...warmupUrls.map(url => nodeFetch(url, {agent}).then(res => res.text())),
  ...warmupUrls.map(url => axios.get(url, {httpsAgent, responseType: "text"})),
  ...warmupUrls.map(url => undiciFetch(url, {dispatcher}).then(res => res.text())),
]);

const t3 = performance.now();
await Promise.all(urls.map(url => axios.get(url, {httpsAgent, responseType: "text"})));
console.info(`axios: ${Math.round(performance.now() - t3)}ms`);

const t2 = performance.now();
await Promise.all(urls.map(url => nodeFetch(url, {agent}).then(res => res.text())));
console.info(`node-fetch: ${Math.round(performance.now() - t2)}ms`);

const t1 = performance.now();
await Promise.all(urls.map(url => undiciFetch(url, {dispatcher}).then(res => res.text())));
console.info(`undici: ${Math.round(performance.now() - t1)}ms`);
