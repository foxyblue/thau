# Thau

Ready-to-use authentication service for your application. With a React connector.

## Motivation

Authentication is always a nightmare. Every time you start a new small pet project, you reimplement the wheel solving a "how to make user login" problem. **Thau** is here for you!

**Thau** is a ready-to-use service that you can integrate easily into your project that handles authentication for you.

**Thau** is data storage agnostic (currently supported data storages: `SQLite`, `MongoDB`, `Postgres`, but the list is easily extendable).

**Thau** is authentication strategy agnostic  (currently supported strateegies: `password`, `google`, `facebook`, but the list is easily extendable)

**Thau** is running in docker

**Thau** is written in TypeScript so anyone from your team will be able to work with it's source

## Usage

**Thau** has 2 parts:
1. [thau-api](https://github.com/MGrin/thau/blob/master/thau-api/README.md) - backend service that interacts with your data storage and provides an API for your applications to consume.
2. [react-thau](https://github.com/MGrin/thau/blob/master/react-thau/README.md) - react library that contains all required client-side code to work with `thau-api`.

In order to start the `thau-api` service, you have to provide a list of configurations (such as selected data storage and credentials to access it) as well as login strategies parametres (such as Google Client ID). Here is a simplest example (through it is very configurable):
```
docker run -e ENABLED_STRATEGIES=password -e ENV=local -e PORT=9000 -e DATA_BACKEND=sqlite mgrin/thau
```

Please see related documentations for more information

## Development

You can start 3 instances of **Thau** with 3 different data backends (sqlite, postgres and mongo) by:
```
make dev
```

To run integration tests, you can
```
make test
```
