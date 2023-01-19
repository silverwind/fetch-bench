node_modules: package-lock.json
	@npm install --no-save
	@touch node_modules

.PHONY: bench
bench: node_modules
	@node bench.js
	@deno run -A deno.js
	@bun run bun.js
