# fetch-bench

This repo contains benchmarks to compare server-side `fetch` implementations. It starts a local raw-TCP HTTP server serving a fixed ~28KB JSON payload, then has each client run 1 warmup pass + 10 timed passes of 1000 requests each at concurrency 96, all in a single client process so process startup is excluded from the timings.

The local server isolates client overhead from network/CDN noise, and uses a pre-built response buffer over raw TCP so the server cannot be the bottleneck. Reported numbers are pure client work (median, min, max across 10 timed passes, in ms).

# Usage

```
$ make
client  median   min   max
------  ------  ----  ----
undici    50.5  45.3  59.3
deno      31.6  29.2  45.5
bun       11.0   9.9  20.7
axios     66.9  60.9  79.9
got       82.7  75.9  98.7
```
