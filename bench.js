import nodeFetch from "node-fetch";
import {fetch as undiciFetch, Agent as UndiciAgent} from "undici";
import {Agent as HttpsAgent} from "https";
import pkg from "./1500-deps.json" assert {type: "json"};

const urls = Object.keys(pkg.devDependencies).map(name => {
  return `https://registry.npmjs.org/${name.replace(/\//g, "%2f")}`;
});


const t1 = performance.now();
const dispatcher = new UndiciAgent({connections: 96});
await Promise.all(urls.map(async url => {
  const res = await undiciFetch(url, {dispatcher});
  await res.text();
}));
console.info(`undici: ${Math.round(performance.now() - t1)}ms`);

const t2 = performance.now();
const agent = new HttpsAgent({maxSockets: 96});
await Promise.all(urls.map(async url => {
  const res = await nodeFetch(url, {agent});
  await res.text();
}));
console.info(`node-fetch: ${Math.round(performance.now() - t2)}ms`);

process.exit();

