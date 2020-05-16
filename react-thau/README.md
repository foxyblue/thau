# react-thau

Interact with the **Thau** API from you React application. Authentication made easy.

# Installation
```
npm install react-thau
```

or

```
yarn add react-thau
```

# Usage

Firstly you need to have the **Thau** API running. Let's assume that you ran it using the following command:
```
docker run \
    -e ENABLED_STRATEGIES=password,google,facebook \
    -e ENV=local \
    -e DATA_BACKEND=sqlite \
    -e GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID> \
    -e FACEBOOK_CLIENT_ID=<YOUR_FACEBOOK_CLIENT_ID> \
    -e FACEBOOK_CLIENT_SECRET=<YOUR_FACEBOOK_CLIENT_SECRET> \
    mgrin/thau
```

Then, wrap your application with `AuthProvider`:
```tsx
import { AuthProvider } from 'react-thau'

export default function App() {
  <AuthProvider authUrl="http://localhost:9000">
    ...
  </AuthProvider>
}
```

And now down in the tree you can use any of the available exported hooks (see documentation for more details about each of the hooks):
* `useAuth()`
* `useCreateUserWithPassword()`
* `useCurrentProvider()`
* `useLoginWithFacebook()`
* `useLoginWithGoogle()`
* `useLoginWithPassword()`
* `useLogout()`
* `useUser()`

# Documentation

## AuthProvider
Wrapper component. Is required to pass the context value to hooks. Takes following props:
* `authUrl` - **REQUIRED** URL to the **Thau** API instance
* `tokenStorage` - place to store the auth token. Possible values: `localStorage`, `cookie`. *Default*: `localStorage`
* `fetchOptions` - options to pass to the `fetch` call. Used to set custom headers

## useAuth()
Takes no arguments. Returns you the auth state.
```tsx
import * as React from 'react'
import { useAuth } from 'react-thau'

export default () => {
  const auth = useAuth()
  return <p>{JSON.stringify(auth)}</p>
}
```
Auth state type is defined as follows:
* `loading: boolean`
* `error: Error | null`
* `availableStrategies: string[] | null`
* `tokenStorage: 'cookie' | 'localStorage'`
* `google?: { clientId: string } `
* `facebook?: { clientId: string; graphVersion: string }`
* `setUser: (user?: User, provider?: string) => void`
* `user?: User`
* `provider?: string`

## useUser()
Takes no arguments. Returns you the logged in user or undefined.
```tsx
import * as React from 'react'
import { useUser } from 'react-thau'

export default () => {
  const user = useUser()
  return <p>{JSON.stringify(user)}</p>
}
```
User fields:
* `id: string`
* `email: string`
* `username: string`
* `first_name?: string`
* `last_name?: string`
* `date_of_birth?: number`
* `gender?: string`
* `picture?: string`

## useCurrentProvider()
Takes no arguments. Reeturns you the login strategy user used to login
```tsx
import * as React from 'react'
import { useCurrentProvider } from 'react-thau'

export default () => {
  const provider = useCurrentProvider()
  return <p>{provider}</p>
}
```

## useCreateUserWithPassword({ fetchOptions?: FetchOptions })
Takes an optional argument, `fetchOptions`, that will be passed to the respective fetch call. Returns the `[state, createUser: (newUser) => void]` tuple.
```tsx
import * as React from 'react'
import { useCreateUserWithPassword } from 'react-thau'

export default () => {
  const [state, createUser] = useCreateUserWithPassword()
  return <p>{JSON.stringify(state)}</p>
}
```
State fields:
* `loading: boolean`
* `error: APIError | null`
* `token: string | null`

`createUser` function arguments:
* `newUser: NewUserType`:
  * `email: string`
  * `password: string`
  * `username: string`
  * `first_name?: string`
  * `last_name?: string`
  * `date_of_birth?: number`
  * `gender?: string`
  * `picture?: string`

## useLoginWithFacebook({ fetchOptions?: FetchOptions })
Takes an optional argument, `fetchOptions`, that will be passed to the respective fetch call. Returns the `[state, login: () => void]` tuple.
```tsx
import * as React from 'react'
import { useLoginWithFacebook } from 'react-thau'

export default () => {
  const [state, login] = useLoginWithFacebook()
  return <p>{JSON.stringify(state)}</p>
}
```
State fields:
* `loading: boolean`
* `error: APIError | null`
* `token: string | null`
* `user: User | null`

## useLoginWithGoogle({ fetchOptions?: FetchOptions })
Takes an optional argument, `fetchOptions`, that will be passed to the respective fetch call. Returns the `[state, login: () => void]` tuple.
```tsx
import * as React from 'react'
import { useLoginWithGoogle } from 'react-thau'

export default () => {
  const [state, login] = useLoginWithGoogle()
  return <p>{JSON.stringify(state)}</p>
}
```
State fields:
* `loading: boolean`
* `error: APIError | null`
* `token: string | null`
* `user: User | null`

## useLoginWithPassword({ fetchOptions?: FetchOptions })
Takes an optional argument, `fetchOptions`, that will be passed to the respective fetch call. Returns the `[state, login: (credentials: LoginWithPasswordCredentials) => void]` tuple.
```tsx
import * as React from 'react'
import { useLoginWithPassword } from 'react-thau'

export default () => {
  const email = "username@yourapp.com"
  const password = "very_secrt_password"
  const [state, login] = useLoginWithPassword({ email, password })
  return <p>{JSON.stringify(state)}</p>
}
```
State fields:
* `loading: boolean`
* `error: APIError | null`
* `token: string | null`
* `user: User | null`

`login` function arguments:
* `credentials: LoginWithPasswordCredentials`:
  * `email: string`
  * `password: string`

## useLogout()
Takes an optional argument, `fetchOptions`, that will be passed to the respective fetch call. Returns the `[state, logout: () => void]` tuple.
```tsx
import * as React from 'react'
import { useLogout } from 'react-thau'

export default () => {
  const [state, logout] = useLogout()
  return <p>{JSON.stringify(state)}</p>
}
```
