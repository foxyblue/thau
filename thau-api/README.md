# Thau API

**Thau** API can be ran inside the docker or as a standalone node service.

**Thau** API can be configured using ENV variables. 

**Thau** API is documeneted with [swagger](https://thau.quester-app.dev/api-docs) (pass `SWAGGER=1` as environment variable to see it at `/api-docs`)

**Thau** API can broadcast events outsidee through different broadcasting channels. Currently sUpported channels: `http(s)` webhooks, `kafka` topic

# Run
As a docker image:
```
docker run -env-file .env mgrin/thau
```

As a standalone node service:
```
npm install
npm run build
npm start
```

Note that in both examples above we pass the `.env` file with all needed environment variables.

The simplest example of such file:
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
* `USERS_TABLE_NAME` - name for the `USERS` table. Default: `USERS`
* `USER_TOKEN_PAIRS_TABLE_NAME` - name for the `USER_TOKEN_PAIRS` table. Default: `USER_TOKEN_PAIRS`
* `CREDENTIALS_TABLE_NAME` - name for the `CREDENTIALS` table. Default: `CREDENTIALS`
* `USER_PROVIDERS_TABLE_NAME` - name for the `USER_PROVIDERS` table. Default: `USER_PROVIDERS`
* `EVENTS_BROADCAST_CHANNEL` - the events broadcasting channel. Possible values: `http`, `kafka`

## Data Backend configurations
For every `DATA_BACKEND` you have to provide additional variables. The **REQUIRED** now means that it's required only if a given data storage is used:

### Configurations for `DATA_BACKEND=sqlite`:
Example can be seen in [environments/env.sqlite.template](https://github.com/MGrin/thau/blob/master/environments/env.sqlite.template)

* `SQLITE_FILENAME` - **REQUIRED** filename for sqlite DB

### Configurations for `DATA_BACKEND=mongo`:
Example can be seen in [environments/env.mongo.template](https://github.com/MGrin/thau/blob/master/environments/env.mongo.template)

* `MONGO_URL` - **REQUIRED** url to connect to MongoDB
* `MONGO_CLIENT_OPTIONS` - a JSON value with MongoClient parameters that will be passed to the client constructor. Documentation of the shape of these parameters: [http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect](http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect)

### Configurations for `DATA_BACKEND=postgres`:
Example can be seen in [environments/env.postgres.template](https://github.com/MGrin/thau/blob/master/environments/env.postgres.template)

* `PG_HOST` - **REQUIRED** Postgres host
* `PG_PORT` - Postgres port. Default `5432`
* `PG_USER` - Postgres user
* `PG_PASSWORD` - Postgres password
* `PG_DATABASE` - Postgres database
* `PG_CONNECTION_TIMEOUT_MS` - Connection timeout in milliseconds. Default: no timeout
* `PG_IDLE_TIMEOUT_MS` - Connection idle timeout in milliseconds. Default: no timeout
* `PG_MAX_CONNECITONS` - Maximum number of connection in a pool. Deefault: `10`

## Login strategy configurations
For every `ENABLED_STRATEGIES` you have to provide additional variables. The **REQUIRED** now means that it's required only if a given login strategy is used:

### Configuration for the `google` login strategy
In case you put `google` in your `ENABLED_STRATEGIES`, please configuree the following:

* `GOOGLE_CLIENT_ID` - **REQUIRED** your google application client id

### Configuration for the `facebook` login strategy
In case you put `facebook` in your `ENABLED_STRATEGIES`, please configuree the following:

* `FACEBOOK_CLIENT_ID` - **REQUIRED** your google application client id
* `FACEBOOK_CLIENT_SECRET` - **REQUIRED** your google application client secret
* `FACEBOOK_GRAPH_VERSION` - the version of Facebook GraphAPI to use. Default: `v7.0`

## Broadcast channel configuration

Events broadcasted:

* `CREATE_NEW_USER_WITH_PASSWORD` - new user is created with a password strategy. Payload: user id
* `EXCHANGE_FACEBOOK_AUTH_TOKEN_FOR_TOKEN` - a user is authenticated using facebook. Payload: user id
* `EXCHANGE_GOOGLE_ID_TOKEN_FOR_TOKEN` - a user is authenticated using google. Payload: user id
* `EXCHANGE_PASSWORD_FOR_TOKEN` - a user is authenticated using password. Payload: user id
* `EXCHANGE_TOKEN_FOR_USER` - a token is exchanged for user. Payload: user id
* `REVOKE_TOKEN` - a token has been revoked.

For every `EVENTS_BROADCAST_CHANNEL` you have to provide additional variables. The **REQUIRED** now means that it's required only if a given broadcast channel is used.

### Configurations for the `http` broadcast channel:
In case you put `http` in your `EVENTS_BROADCAST_CHANNEL`, please configure thee following:

* `BROADCAST_HTTP_URL` - **REQUIRED** your endpoint that will receive the events
* `BROADCAST_HTTP_HEADERS` - a JSON value with custom headers you need to set for your HTTP webhook to be reached


# Development

Firstly, rename all `environments/env.****.template` to `environments/.env.****.template` with your own values for some variables. These files will be used by `docker-compose` eto bootstrap containers

You can start 4 instances of **Thau** with 3 different data backends (sqlite, postgres and mongo) and http broadcaster by:
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
    << : *thau
    env_file: environments/.env.YOUR_STORAGE
    ports:
      - <LOCALHOST_PORT>:9000
```
6. Add your service to the list of services to test in `environments/.env.tests` into `TESTABLE_DATA_BACKENDS` variable
7. Run `make test` to see if things are working

## New login strategy
TO BE DOCUMENTED

But long story short: look at `thau-api/src/api/tokens` at the `handleExchange` function and at the functions inside `thau-api/src/api/strategies`

## New broadcasting channel
TO BE DOCUMENTED

But long story short: look at `thau-api/src/broadcast`