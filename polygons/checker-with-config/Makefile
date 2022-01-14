PM=npm
NPM_DIRS=foo-checks runner

all: config build-ts dependencies run

config:
	mkdir -p config

dependencies:
	for x in $$(echo "${NPM_DIRS}"); do \
	  cd "$$x"; \
	  ${PM} install; \
	  cd - >/dev/null; \
	done

build-ts:
	git clone git@github.com:htmlacademy/checker-package.git -b feature/checker-config; \
	cd checker-package; \
	${PM} install; \
	${PM} run build; \
	cd - >/dev/null

run:
	cd runner && node ./index.js

clean:
	rm -rf checker-package; \
	rm -rf foo-checks/node_modules; \
	rm -f foo-checks/*-lock.*; \
	rm -rf runner/node_modules; \
	rm -f runner/*-lock.*
