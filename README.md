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
1. `thau-api` - backend service that interacts with your data storage and provides an API for your applications to consume.
2. `react-thau` - react library that contains all required client-side code to work with `thau-api`.

Please see this documentation for how to run `thau-api` and this documentation on how `react-thau`
