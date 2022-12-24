import pAll from "npm:p-all";
import json from "./1500-deps.json" assert {type: "json"}

const urls = Object.keys(json.devDependencies).map(name => `https://registry.npmjs.org/${name.replace(/\//g, "%2f")}`);
const warmupUrls = urls.slice(0, 10);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// warm up the JIT
await Promise.all([
  ...warmupUrls.map(url => fetch(url).then(res => res.text())),
]);

await sleep(500);

const t1 = performance.now();
await pAll(urls.map(url => {
  return () => {
    return fetch(url).then(res => res.text());
  }
}), {concurrency: 96});
console.info(`deno: ${Math.round(performance.now() - t1)}ms`);
