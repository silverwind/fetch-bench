# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make bench
axios: 2515ms
node-fetch: 4812ms
undici: 2868ms
deno: 2244ms
bun: 2730ms
```
