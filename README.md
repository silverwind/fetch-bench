# fetch-bench

This repo contains benchmarks to compare server-side `fetch` implementations. It starts a local Node.js HTTP server serving a fixed ~28KB JSON payload, then has each client run 1 warmup pass + 10 timed passes of 2000 requests each at concurrency 96, all in a single client process so process startup is excluded from the timings.

The local server isolates client overhead from network/CDN noise. Reported numbers are pure client work (median, min, max across 10 timed passes, in ms).

# Usage

```
$ make
client  median    min    max
------  ------  -----  -----
undici    92.8   83.0   95.7
deno      63.2   57.6   69.5
bun       25.6   21.6   28.0
axios    128.0  114.9  134.0
got      158.5  129.7  164.1
```
