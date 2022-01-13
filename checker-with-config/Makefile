PM=pnpm

all: config dependencies run

config:
	mkdir -p config

dependencies:
	cd foo-checks && ${PM} install

run:
	cd runner && node ./index.js

clean:
	cd foo-checks && rm -rf node_modules *-lock.*
