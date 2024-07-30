# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make
node-fetch: 1324ms
undici: 1448ms
deno: 1457ms
bun: 1231ms
axios: 1392ms
got: 1341ms
```
