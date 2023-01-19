import {readFileSync} from "fs";
import pAll from "p-all";

const pkg = JSON.parse(readFileSync(new URL("1500-deps.json", import.meta.url)));
const urls = Object.keys(pkg.devDependencies).map(name => `https://registry.npmjs.org/${name.replace(/\//g, "%2f")}`);
const warmupUrls = urls.slice(0, 10);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const opts = {concurrency: process.argv[2] ? Number(process.argv[2]) : 96};

// warm up the JIT
await Promise.all([
    ...warmupUrls.map(url => fetch(url).then(res => res.text())),
]);

await sleep(500);

const t2 = performance.now();
await pAll(urls.map(url => () => fetch(url).then(res => res.text())), opts);
console.info(`bun: ${Math.round(performance.now() - t2)}ms`);
