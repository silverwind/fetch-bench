# fetch-bench

This repo contains benchmarks to compare server-side `fetch` implementations. It starts a local Node.js HTTP server serving a fixed ~28KB JSON payload, then has each client run 1 warmup pass + 10 timed passes of 2000 requests each at concurrency 96, all in a single client process so process startup is excluded from the timings.

The local server isolates client overhead from network/CDN noise. Reported numbers are pure client work measured per-pass: wallclock `median` / `min` / `max`, plus median `user` and `sys` CPU time (`process.cpuUsage()`, summed across all process threads). All values in milliseconds.

This benchmark measures client-side overhead only — not real-world network behavior. Under a slow or lossy network the wallclock differences between clients largely disappear.

# Usage

```
$ make
client          median    min    max   user   sys
--------------  ------  -----  -----  -----  ----
node:http         64.2   59.9   74.1   65.2  16.4
node-fetch       135.4  112.9  150.0  174.7  21.7
undici-fetch      98.3   84.4  104.9  133.4  21.5
undici-request    51.9   39.9   57.5   71.2  15.2
undici-pool       48.0   43.7   49.9   63.6  15.8
deno              61.1   58.6   76.5   47.5  26.4
bun               26.5   23.8   37.7   22.5  21.2
ky               127.2   97.8  139.7  172.0  22.5
ofetch           113.5  102.7  119.4  158.6  23.6
axios            133.5  125.7  140.3  176.4  22.3
got              160.8  128.1  179.7  207.4  21.8
```
