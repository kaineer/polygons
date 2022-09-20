node_modules:
	npm install

run:
	mkdir -p artifacts
	node index.js

all: node_modules run

clean:
	rm -rf node_modules
	rm -rf artifacts

.PHONY: all run clean
