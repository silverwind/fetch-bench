import {readFileSync} from "node:fs";
import pAll from "p-all";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runFetch(url, fn, fnOpts) {
  const res = await (fnOpts?.responseType ? fn(url, fnOpts) : fn(url));
  if (!fnOpts?.responseType) {
    await res.text();
  }
}

export async function run(name, fn, fnOpts = {}) {
  const pkg = JSON.parse(readFileSync(new URL("1500-deps.json", import.meta.url)));
  const urls = Object.keys(pkg.devDependencies).map(name => `https://registry.npmjs.org/${name.replace(/\//g, "%2f")}`);
  const pAllOpts = {concurrency: 96};

  // warm up the JIT
  await pAll(urls.slice(0, 10).map(url => () => runFetch(url, fn, fnOpts), pAllOpts));
  await sleep(250);

  const t1 = performance.now();
  await pAll(urls.map(url => () => runFetch(url, fn, fnOpts), pAllOpts));
  console.info(`${name}: ${Math.round(performance.now() - t1)}ms`);
}
