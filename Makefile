.PHONY: bench
bench:
	@node bench.js
	@deno run -A deno.js
	@bun run bun.js
