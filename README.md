# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make
node-fetch: 5020ms
undici: 3247ms
deno: 2214ms
bun: 1696ms
axios: 2357ms
got: 2980ms
```
