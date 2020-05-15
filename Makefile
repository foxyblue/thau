.PHONY:

stop:
	docker-compose down --remove-orphans

build: stop
	docker-compose build

dev: build
	docker-compose up -d
	docker-compose ps
format:
	cd thau-api && yarn prettier:write
	cd react-thau && yarn prettier:write
	cd tests && yarn prettier:write

test: dev
	docker build -t thau-tests -f tests/Dockerfile tests/
	docker run \
		--network=thau_thau-network \
		--env-file ./environments/.env.tests \
		-e "TERM=xterm-256color" \
		thau-tests