all: clean prepare run

clean:
	rm -rf sink-{1,2}.0/{node_modules,pnpm-lock.yaml}
prepare:
	npm i -g pnpm
	cd sink-1.0 && pnpm i && cd -
	cd sink-2.0 && pnpm i && cd -
run:
	cd root && node . && cd -

.PHONY: clean prepare run all
