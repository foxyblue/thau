.PHONY:

stop:
	docker-compose down --remove-orphans

build: stop
	docker-compose build

dev: build
	docker-compose up -d
	docker-compose ps

format:
	cd thau-api && yarn prettier:write && yarn lint
	cd react-thau && yarn prettier:write && yarn lint
	cd tests && yarn prettier:write && yarn lint

test: dev
	sleep 5
	docker build -t thau-tests -f tests/Dockerfile tests/
	docker run \
		--network=thau_thau-network \
		--env-file ./environments/.env.tests \
		-p 10000:10000 \
		-e "TERM=xterm-256color" \
		thau-tests

test-ci:
	docker-compose -f docker-compose.ci.yaml down

	echo "BUILDING THE IMAGE"
	cd thau-api && docker build --target prod --tag mgrin/thau:local .
	cd ../

	echo "RUNNING docker-compose.ci"
	docker-compose -f docker-compose.ci.yaml up -d
	docker-compose -f docker-compose.ci.yaml ps

	echo "BUILDING TESTS IMAGE"
	docker build -t mgrin/thau-tests:local -f tests/Dockerfile tests/

	echo "RUNNING TESTS"
	docker run \
		--network=thau_thau-network \
		-e TESTABLE_DATA_BACKENDS=sqlite,mongo,postgres,sqlite-http \
		-e ENABLED_STRATEGIES=password \
		-e WEBHOOK_PORT=10000 \
		-e "TERM=xterm-256color" \
		mgrin/thau-tests:local