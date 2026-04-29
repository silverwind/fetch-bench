# fetch-bench

This repo contains benchmarks to compare server-side `fetch` implementations. It starts a local Node.js HTTP server serving a fixed ~28KB JSON payload, then has each client run 1 warmup pass + 10 timed passes of 2000 requests each at concurrency 96, all in a single client process so process startup is excluded from the timings.

The local server isolates client overhead from network/CDN noise. Reported numbers are pure client work (median, min, max across 10 timed passes, in ms).

# Usage

```
$ make
client      median    min    max
----------  ------  -----  -----
node:http     64.2   60.6   74.7
node-fetch   135.0  121.7  159.6
undici7       94.0   86.5  111.1
undici8       92.7   83.1  115.9
deno          59.7   55.5   66.4
bun           25.2   22.6   32.1
ky           119.7  103.9  151.2
ofetch        99.3   87.7  119.8
axios        127.9  121.7  140.2
got          160.3  146.6  176.1
```
