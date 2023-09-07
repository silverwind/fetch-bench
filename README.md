# fetch-bench

This repo contains benchmarks to compare of server-side `fetch` implementations. It fetches 1500 JSON files from npm with concurrency of 96 and outputs the total time taken.

# Usage

```
$ make
node-fetch: 3390ms
undici: 2966ms
deno: 3866ms
bun: 1931ms
axios: 2429ms
got: 2883ms
```
