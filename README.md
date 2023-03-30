# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make
axios: 2825ms
node-fetch: 5107ms
undici: 2880ms
deno: 1660ms
bun: 2182ms
```
