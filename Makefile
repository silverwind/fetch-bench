.PHONY: bench
bench: node_modules
	@node bench.js

node_modules: pnpm-lock.yaml
	@pnpm install
	@touch node_modules

.PHONY: update
update: node_modules
	pnpm exec updates -cu
	rm -rf node_modules pnpm-lock.yaml
	pnpm install
	@touch node_modules
