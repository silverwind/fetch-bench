.PHONY: bench
bench: node_modules
	@node nodefetch.js
	@node undici.js
	@deno run -A deno.js
	@bun run bun.js
	@node axios.js
	@node got.js

node_modules: pnpm-lock.yaml
	@pnpm install
	@touch node_modules
