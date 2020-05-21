# Thau
<img src="https://github.com/MGrin/thau/raw/master/thau.png" width="250" />

[Medium article](https://medium.com/@mgrin/thau-an-ultimate-authentication-service-with-react-connector-1412dcaa835e?source=friends_link&sk=d802e4eb4b78d3213af2f09b6c5c8eec)

Ready-to-use authentication service for your application. With a React connector.

- [Swagger](https://thau.quester-app.dev/api-docs)
- [React integration documentation and examples](https://github.com/MGrin/thau/tree/master/react-thau)

# Motivation

Authentication is always a nightmare. Every time you start a new small pet project, you reimplement the wheel solving a "how to make user login" problem. **Thau** is here for you!

**Thau** is a ready-to-use service that you can integrate easily into your project that handles authentication for you.

**Thau** is data storage agnostic (currently supported data storages: `SQLite`, `MongoDB`, `Postgres`, but the list is easily extendable).

**Thau** is authentication strategy agnostic  (currently supported strateegies: `password`, `google`, `facebook`, but the list is easily extendable)

**Thau** is running in docker

**Thau** is written in TypeScript so anyone from your team will be able to work with it's source

# Idea
![Idea](https://github.com/MGrin/thau/raw/master/Schema.png)

The **Thau** API exchange any of the supported login strategies for a token, that can be exchanged for a user against the same **Thau** API.

No matter what's the strategy you user choose to use, you always get back a token and a user object having the same shape

If you are using **Thau** API with `react-thau`, this token is then stored in `localStorage` or in `Cookies` of your client.

You can still use the **Thau** API without `react-thau`, then the client implementation is on your own responsebility. But the API is still here for you to generate a token for any supported login strategy and to exchange the token for a user object.

# Usage

**Thau** has 2 parts:
1. [thau-api](https://github.com/MGrin/thau/blob/master/thau-api) - backend service that interacts with your data storage and provides an API for your applications to consume.
2. [react-thau](https://github.com/MGrin/thau/blob/master/react-thau) - react library that contains all required client-side code to work with `thau-api`.

In order to start the `thau-api` service, you have to provide a list of configurations (such as selected data storage and credentials to access it) as well as login strategies parametres (such as Google Client ID). Here is a simplest example (through it is very configurable):
```
docker run -e ENABLED_STRATEGIES=password -e ENV=local -e DATA_BACKEND=sqlite mgrin/thau
```

Please see related documentations for more information, or the `examples` folder where you can find examples of appliciations

