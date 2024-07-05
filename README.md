# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make
node-fetch: 3379ms
undici: 3037ms
deno: 1903ms
bun: 2309ms
axios: 4597ms
got: 14470ms
```
