# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make
node-fetch: 1297ms
undici: 964ms
deno: 1575ms
bun: 1133ms
axios: 1098ms
got: 1266ms
```
