# fetch-bench

This repo contains benchmarks to compare server-side `fetch` implementations. It starts a local Node.js HTTP server serving a fixed ~28KB JSON payload, then has each client run 1 warmup pass + 10 timed passes of 2000 requests each at concurrency 96, all in a single client process so process startup is excluded from the timings.

The local server isolates client overhead from network/CDN noise. Reported numbers are pure client work measured per-pass: wallclock `median` / `min` / `max`, plus median `user` and `sys` CPU time (`process.cpuUsage()`, summed across all process threads). All values in milliseconds.

This benchmark measures client-side overhead only — not real-world network behavior. Under a slow or lossy network the wallclock differences between clients largely disappear.

Example output:

```
$ make
client          median    min    max   user   sys
--------------  ------  -----  -----  -----  ----
node:http         59.6   55.5   77.9   57.7  12.1
node-fetch       138.4  112.7  154.1  193.3  18.8
undici-fetch      95.0   85.7  100.8  123.8  21.4
undici-request    51.8   43.1   60.6   59.9  16.8
undici-pool       48.8   42.3   60.7   54.7  16.9
deno              61.3   57.9   69.3   49.9  20.1
bun               31.7   30.1   32.6   26.8  43.7
ky               127.0  103.8  308.9  178.7  22.8
ofetch           117.8  100.8  307.0  154.8  23.6
axios            158.9  146.3  176.4  191.4  26.1
got              173.9  137.4  192.1  223.9  20.5
```
