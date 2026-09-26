import {readFileSync} from "node:fs";
import pAll from "p-all";

export const ORIGIN = `http://127.0.0.1:${Number(process.env.PORT) || 3210}`;

const REQUESTS_PER_RUN = 2000;
const TIMED_RUNS = 10;
const WARMUP_RUNS = 1;
const CONCURRENCY = 96;
const WARMUP_PAUSE_MS = 100;

const median = arr => {
  const sorted = arr.toSorted((firstNum, secondNum) => firstNum - secondNum);
  return sorted.length % 2 ?
    sorted[(sorted.length - 1) / 2] :
    (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
};

async function runFetch(url, fn, fnOpts) {
  if (fnOpts.responseType) {
    await fn(url, fnOpts);
  } else {
    await (await fn(url)).text();
  }
}

export async function run(name, fn, fnOpts = {}) {
  const depNames = Object.keys(JSON.parse(readFileSync(new URL("1500-deps.json", import.meta.url))).devDependencies);
  const urls = Array.from({length: REQUESTS_PER_RUN}, (_, idx) => `${ORIGIN}/${depNames[idx % depNames.length].replaceAll("/", "%2f")}?n=${idx}`);
  const runAll = () => pAll(urls.map(url => () => runFetch(url, fn, fnOpts)), {concurrency: CONCURRENCY});

  for (let warmupIdx = 0; warmupIdx < WARMUP_RUNS; warmupIdx++) {
    await runAll();
  }
  await new Promise(resolve => setTimeout(resolve, WARMUP_PAUSE_MS));

  const times = [];
  const userCpu = [];
  const sysCpu = [];
  for (let runIdx = 0; runIdx < TIMED_RUNS; runIdx++) {
    const cpuStart = process.cpuUsage();
    const t1 = performance.now();
    await runAll();
    times.push(performance.now() - t1);
    const cpu = process.cpuUsage(cpuStart);
    userCpu.push(cpu.user / 1000);
    sysCpu.push(cpu.system / 1000);
  }

  console.info([name, ...[median(times), Math.min(...times), Math.max(...times), median(userCpu), median(sysCpu)].map(ms => ms.toFixed(1))].join("\t"));
}
