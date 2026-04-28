.PHONY: bench
bench: node_modules
	@node bench.js

node_modules: pnpm-lock.yaml
	@pnpm install
	@touch node_modules
