PM=pnpm

all: config dependencies run

config:
	mkdir -p config

dependencies:
	cd foo-checks && ${PM} install && cd ../runner && ${PM} install

run:
	cd runner && node ./index.js

clean:
	rm -rf {foo-checks,runner}/{node_modules,*-lock.*}
