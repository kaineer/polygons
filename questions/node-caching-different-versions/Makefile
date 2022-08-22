all: clean prepare run

clean:
	rm -rf root/node_modules
	rm -f root/pnpm-lock.yaml
	rm -rf sink-1.0/node_modules
	rm -f sink-1.0/pnpm-lock.yaml
	rm -rf sink-2.0/node_modules
	rm -f sink-2.0/pnpm-lock.yaml

prepare:
	npm i -g --no-audit pnpm >/dev/null
	cd sink-1.0 && pnpm i -s && cd - >/dev/null
	cd sink-2.0 && pnpm i -s && cd - >/dev/null
run:
	cd root && node . && cd - >/dev/null

.PHONY: clean prepare run all

ifndef VERBOSE
.SILENT:
endif
