# fetch-bench

This repo contains benchmarks to compare server-side `fetch` implementations. It starts a local Node.js HTTP server serving a fixed ~28KB JSON payload, then has each client run 1 warmup pass + 10 timed passes of 2000 requests each at concurrency 96, all in a single client process so process startup is excluded from the timings.

The local server isolates client overhead from network/CDN noise. Reported numbers are pure client work measured per-pass: wallclock `median` / `min` / `max`, plus median `user` and `sys` CPU time (`process.cpuUsage()`, summed across all process threads). All values in milliseconds.

This benchmark measures client-side overhead only — not real-world network behavior. Under a slow or lossy network the wallclock differences between clients largely disappear.

# Usage

```
$ make
client      median    min    max   user   sys
----------  ------  -----  -----  -----  ----
node:http     65.4   59.3   71.7   67.6  17.2
node-fetch   128.2  114.4  157.3  163.8  22.2
undici7       92.5   84.6  109.3  115.6  24.0
undici8       91.3   81.1  112.7  119.7  22.9
deno          57.7   54.9   69.3   43.6  25.0
bun           24.6   21.9   32.7   20.5  19.1
ky           119.3  112.0  145.0  171.7  24.2
ofetch        98.8   87.3  120.3  128.5  22.1
axios        130.1  120.9  145.0  175.5  23.6
got          159.9  138.5  191.0  195.5  22.2
```
