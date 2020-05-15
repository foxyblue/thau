# Thau API

**Thau** API can be ran inside the docker or as a standalone node service.

**Thau** API can be configured using ENV variables. 

**Thau** API is documeneted with [swagger](https://thau.quester-app.dev/api-docs) (pass `SWAGGER=1` as environment variable to see it at `/api-docs`)

# Run
```
docker run -env-file .env mgrin/thau
```

Note that in the example below we pass the `.env` file with all needed environment variables.

The siimplest example of such file:
```
ENV=local
ENABLED_STRATEGIES=password
DATA_BACKEND=sqlite
SQLITE_FILENAME=db
```

See next section to know more about configuration options

# Configure

## General confgurations:
* `ENV` - **REQUIRED** the name of environment the service is running.
* `DATA_BACKEND` - **REQUIRED** the data storage type. Possible values: `sqlite`, `postgres`, `mongo`
* `ENABLED_STRATEGIES` - **REQUIRED** commma-separated list of enabled login strategies. Possible values: `password`, `google`, `facebook`
* `PUBLIC_RSA_KEY` - Public RSA key in base64 encoding. Is served over API and is used to encrypt free-text password sent from the client
* `PRIVATE_RSA_KEY` - Private RSA key in base64 encoding. Used to decrypt the password

For every `DATA_BACKEND` and login strategy you have to provide additional variables. The **REQUIRED** now means that it's requuired only if a given data storage or a given login strategy is used:

## Configurations for `DATA_BACKEND=sqlite`:
Example can be seen in [environments/env.sqlite.template](https://github.com/MGrin/thau/blob/master/environments/env.sqlite.template)

* `SQLITE_FILENAME` - **REQUIRED** filename for sqlite DB

## Configurations for `DATA_BACKEND=mongo`:
Example can be seen in [environments/env.mongo.template](https://github.com/MGrin/thau/blob/master/environments/env.mongo.template)

* `MONGO_URL` - **REQUIRED** url to connect to MongoDB
* `MONGO_CLIENT_OPTIONS` - a JSON value with MongoClient parameters that will be passed to the client constructor. Documentation of the shape of these parameters: [http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect](http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect)

## Configurations for `DATA_BACKEND=postgres`:
Example can be seen in [environments/env.postgres.template](https://github.com/MGrin/thau/blob/master/environments/env.postgres.template)

* `PG_HOST` - **REQUIRED** Postgres host
* `PG_PORT` - Postgres port. Default `5432`
* `PG_USER` - Postgres user
* `PG_PASSWORD` - Postgres password
* `PG_DATABASE` - Postgres database
* `PG_CONNECTION_TIMEOUT_MS` - Connection timeout in milliseconds. Default: no timeout
* `PG_IDLE_TIMEOUT_MS` - Connection idle timeout in milliseconds. Default: no timeout
* `PG_MAX_CONNECITONS` - Maximum number of connection in a pool. Deefault: `10`

## Configuration for the `google` login strategy
In case you put `google` in your `ENABLED_STRATEGIES`, please configuree the following:

* `GOOGLE_CLIENT_ID` - **REQUIRED** your google application client id

## Configuration for the `facebook` login strategy
In case you put `facebook` in your `ENABLED_STRATEGIES`, please configuree the following:

* `FACEBOOK_CLIENT_ID` - **REQUIRED** your google application client id
* `FACEBOOK_CLIENT_SECRET` - **REQUIRED** your google application client secret
* `FACEBOOK_GRAPH_VERSION` - the version of Facebook GraphAPI to use. Default: `v7.0`

# Development

Firstly, rename all `environments/env.****.template` to `environments/.env.****.template` with your own values for some variables. These files will be used by `docker-compose` eto bootstrap containers

You can start 3 instances of **Thau** with 3 different data backends (sqlite, postgres and mongo) by:
```
make dev
```

To run integration tests, you can
```
make test
```

## New data backend
You can easily implement the new backend. To do so you'll have to:
1. Create new folder in `thau-api/src/storage/` that will have as default export a class extending `AStorage` abstract class (and so implement all required methods)
2. Add this new storage to the `thau-api/src/storage/index.ts` switch/case return
3. Add a section in the `thau-api/src/configs.ts` file (inside the switch/case over `configs.data_backend`) that will read configurations for your new storage, validate them and pass to the configs object
4. Add new environment file to `thau-api/environments` that will be used by docker-compose to start the test service using your nwely built storage
5. Add new service in `docker-compose.yaml` file following this template:
```
  service: thau-YOUR_STORAGE
    build:
      context: ./thau-api
      target: dev
    env_file: environments/.env.YOUR_STORAGE
    volumes:
      - ./thau-api:/usr/app:ro
    ports:
      - 9004:9000
    networks:
      - thau-network
```
6. Add your service to the list of services to test in `tests/srs/utils.ts`:
    * `BACKENDS` contains the list of hosts to run tests againts
    * `NAMES` contains the mapping between the host and the storage name
7. Run `make test` to see if things are working

## New login strategy
TO BE DOCUMENTED

But long story short: look at `thau-api/src/api/tokens` at the `handleExchange` function and at the functions inside `thau-api/src/api/strategies`