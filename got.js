import {readFileSync} from "node:fs";
import pAll from "p-all";
import got from "got";

const pkg = JSON.parse(readFileSync(new URL("1500-deps.json", import.meta.url)));
const urls = Object.keys(pkg.devDependencies).map(name => `https://registry.npmjs.org/${name.replace(/\//g, "%2f")}`);
const warmupUrls = urls.slice(0, 10);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const opts = {concurrency: process.argv[2] ? Number(process.argv[2]) : 96};

// warm up the JIT
await warmupUrls.map(url => got.get(url, {responseType: "text"}));
await sleep(500);

const t1 = performance.now();
await pAll(urls.map(url => () => got.get(url, {responseType: "text"})), opts);
console.info(`got: ${Math.round(performance.now() - t1)}ms`);
