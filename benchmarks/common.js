import {readFileSync} from "node:fs";
import pAll from "p-all";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const PORT = Number(process.env.PORT) || 3210;

const REQUESTS_PER_RUN = 2000;
const TIMED_RUNS = 10;
const WARMUP_RUNS = 1;
const CONCURRENCY = 96;
const WARMUP_PAUSE_MS = 100;

const median = arr => {
  const sorted = arr.slice().sort((firstNum, secondNum) => firstNum - secondNum);
  return sorted.length % 2 ?
    sorted[(sorted.length - 1) / 2] :
    (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
};

async function runFetch(url, fn, fnOpts) {
  const res = await (fnOpts?.responseType ? fn(url, fnOpts) : fn(url));
  if (!fnOpts?.responseType) {
    await res.text();
  }
}

export async function run(name, fn, fnOpts = {}) {
  const pkg = JSON.parse(readFileSync(new URL("1500-deps.json", import.meta.url)));
  const depNames = Object.keys(pkg.devDependencies);
  const urls = Array.from({length: REQUESTS_PER_RUN}, (_, idx) => {
    const depName = depNames[idx % depNames.length];
    return `http://127.0.0.1:${PORT}/${depName.replace(/\//g, "%2f")}?n=${idx}`;
  });
  const pAllOpts = {concurrency: CONCURRENCY};

  for (let warmupIdx = 0; warmupIdx < WARMUP_RUNS; warmupIdx++) {
    await pAll(urls.map(url => () => runFetch(url, fn, fnOpts)), pAllOpts);
  }
  await sleep(WARMUP_PAUSE_MS);

  const times = [];
  const userCpu = [];
  const sysCpu = [];
  for (let runIdx = 0; runIdx < TIMED_RUNS; runIdx++) {
    const cpuStart = process.cpuUsage();
    const t1 = performance.now();
    await pAll(urls.map(url => () => runFetch(url, fn, fnOpts)), pAllOpts);
    times.push(performance.now() - t1);
    const cpu = process.cpuUsage(cpuStart);
    userCpu.push(cpu.user / 1000);
    sysCpu.push(cpu.system / 1000);
  }

  const min = Math.min(...times);
  const max = Math.max(...times);
  const wallMedian = median(times);
  const userMedian = median(userCpu);
  const sysMedian = median(sysCpu);

  console.info(`${name}\t${wallMedian.toFixed(1)}\t${min.toFixed(1)}\t${max.toFixed(1)}\t${userMedian.toFixed(1)}\t${sysMedian.toFixed(1)}`);
}
