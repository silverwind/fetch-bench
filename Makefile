.DEFAULT_GOAL := bench

node_modules: pnpm-lock.yaml
	pnpm install
	@touch node_modules

.PHONY: deps
deps: node_modules

.PHONY: lint
lint: node_modules
	pnpm exec eslint-silverwind --color .

.PHONY: lint-fix
lint-fix: node_modules
	pnpm exec eslint-silverwind --color . --fix

.PHONY: test
test: node_modules

.PHONY: build
build: node_modules

.PHONY: bench
bench: node_modules
	@node bench.js

.PHONY: update
update: update-js update-actions

.PHONY: update-js
update-js: node_modules
	pnpm exec updates -u -f package.json
	rm -rf node_modules pnpm-lock.yaml
	pnpm install
	@touch node_modules

.PHONY: update-actions
update-actions: node_modules
