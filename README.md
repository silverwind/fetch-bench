# fetch-bench

This repo contains benchmarks to compare server-side `fetch` implementations. It starts a local Node.js HTTP server serving a fixed ~28KB JSON payload, then has each client run 1 warmup pass + 10 timed passes of 2000 requests each at concurrency 96, all in a single client process so process startup is excluded from the timings.

The local server isolates client overhead from network/CDN noise. Reported numbers are pure client work measured per-pass: wallclock `median` / `min` / `max`, plus median `user` and `sys` CPU time (`process.cpuUsage()`, summed across all process threads). All values in milliseconds.

This benchmark measures client-side overhead only — not real-world network behavior. Under a slow or lossy network the wallclock differences between clients largely disappear.

# Usage

```
$ make
client          median    min    max   user   sys
--------------  ------  -----  -----  -----  ----
node:http         64.5   60.3   75.2   66.5  18.3
node-fetch       133.1  125.8  164.5  162.6  21.7
undici-fetch      92.7   84.8  121.7  116.7  23.0
undici-request    48.6   41.4   60.1   59.1  15.6
undici-pool       45.6   42.1   64.0   63.2  15.3
deno              59.9   58.4   65.7   45.7  26.3
bun               25.6   22.7   40.5   20.4  20.6
ky               124.2  108.7  146.3  174.2  23.4
ofetch           100.7   90.6  117.3  125.4  25.1
axios            127.7  120.0  149.8  169.0  22.0
got              162.4  144.0  183.7  206.2  25.4
```
