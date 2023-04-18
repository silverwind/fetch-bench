# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make
node-fetch: 5025ms
undici: 3113ms
deno: 2423ms
bun: 2083ms
axios: 2016ms
got: 2604ms
```
