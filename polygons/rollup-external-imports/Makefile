PM=pnpm
OUTPUT="./dist/output.js"

all: install generate run

install:
	${PM} install

generate: dist
	rm -f ${OUTPUT} && node ./index.js

dist:
	mkdir -p dist

run:
	[ -f ${OUTPUT} ] && (node ${OUTPUT} && echo "done" || bat -p ${OUTPUT})
