import * as React from 'react'
import { authContext, AuthContextType } from './context'
import { FetchOptions, User, Config } from './types'
import { getToken, setToken, generateFacebookInitScript } from './utils'

type State = Omit<AuthContextType, 'setUser'>
const initialState: State = {
  loading: true,
  error: null,
  availableStrategies: null,
  tokenStorage: 'localStorage',
  user: undefined,
  provider: undefined,
}

export type AuthProviderProps = {
  authUrl: string
  tokenStorage?: typeof initialState.tokenStorage
  fetchOptions?: FetchOptions
}

type Action =
  | {
      type: 'RESET'
      authUrl: string
      tokenStorage: typeof initialState.tokenStorage
    }
  | { type: 'ERROR'; error: Error }
  | {
      type: 'CONFIGS_SUCCESS'
      strategies: string[]
      publicKey: string
      google?: typeof initialState.google
      facebook?: typeof initialState.facebook
    }
  | { type: 'USER_SUCCESS'; user?: User; provider?: string }
  | { type: 'DONE' }

const constructConfigSuccessAction = (body: Config) => {
  const action: Action = {
    type: 'CONFIGS_SUCCESS',
    strategies: body.strategies,
    publicKey: body.key,
  }

  if (body.strategies.indexOf('google') !== -1) {
    if (!body.google || !body.google.clientId) {
      throw new Error(
        `Google strategy is enabled but no google client id was provided by the backend service`
      )
    }
    action.google = {
      clientId: body.google.clientId,
    }
  }

  if (body.strategies.indexOf('facebook') !== -1) {
    if (!body.facebook || !body.facebook.clientId) {
      throw new Error(
        `Facebook strategy is enabled but no facebook client id was provided by the backend service`
      )
    }

    action.facebook = {
      clientId: body.facebook.clientId,
      graphVersion: body.facebook.graphVersion || 'v7.0',
    }
  }

  return action
}

const initialFetch = async (
  authUrl: string,
  tokenStorage: typeof initialState.tokenStorage,
  dispatch: React.Dispatch<Action>,
  fetchOptions?: FetchOptions
) => {
  dispatch({ type: 'RESET', authUrl, tokenStorage })

  try {
    const response = await fetch(`${authUrl}/configs`, fetchOptions)
    const body = await response.json()
    if (response.status !== 200) {
      let errorMessage: string

      if (body.status && body.message) {
        errorMessage = body.message
      } else {
        errorMessage = response.statusText
      }

      return dispatch({
        type: 'ERROR',
        error: new Error(errorMessage),
      })
    }

    dispatch(constructConfigSuccessAction(body))

    const token = getToken(tokenStorage)

    if (token) {
      const userResponse = await fetch(
        `${authUrl}/tokens/user?token=${token}`,
        fetchOptions
      )
      if (userResponse.status !== 200) {
        setToken(tokenStorage)
      } else {
        const { user, provider } = await userResponse.json()
        dispatch({ type: 'USER_SUCCESS', user, provider })
      }
    }

    return dispatch({ type: 'DONE' })
  } catch (error) {
    return dispatch({ type: 'ERROR', error: new Error(error.message) })
  }
}

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'RESET': {
      return {
        ...initialState,
        authUrl: action.authUrl,
        tokenStorage: action.tokenStorage,
      }
    }

    case 'ERROR': {
      return {
        ...state,
        loading: false,
        error: action.error,
        availableStrategies: null,
        user: undefined,
      }
    }

    case 'CONFIGS_SUCCESS': {
      return {
        ...state,
        error: null,
        availableStrategies: action.strategies,
        google: action.google,
        facebook: action.facebook,
      }
    }

    case 'USER_SUCCESS': {
      return {
        ...state,
        error: null,
        user: action.user,
        provider: action.provider,
      }
    }

    case 'DONE': {
      return {
        ...state,
        loading: false,
      }
    }

    default: {
      return {
        ...state,
      }
    }
  }
}

const AuthProvider: React.FunctionComponent<AuthProviderProps> = ({
  authUrl,
  tokenStorage,
  fetchOptions,
  children,
}) => {
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    initialState
  )

  React.useEffect(() => {
    initialFetch(
      authUrl,
      tokenStorage || initialState.tokenStorage,
      dispatch,
      fetchOptions
    )
  }, [authUrl])
  React.useEffect(() => {
    if (state.google && !document.querySelector('#gapi-loader')) {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.async = true
      script.id = 'gapi-loader'
      document.body.appendChild(script)
    }

    if (state.facebook && !document.querySelector('#facebookapi-loader')) {
      const script = document.createElement('script')
      script.id = 'facebookapi-loader'
      script.innerHTML = generateFacebookInitScript(state.facebook)
      document.body.appendChild(script)
    }
  }, [state])

  const contextValue = {
    ...state,
    setUser: (u?: User, p?: string) =>
      dispatch({ type: 'USER_SUCCESS', user: u, provider: p }),
  }
  return (
    <authContext.Provider value={contextValue}>{children}</authContext.Provider>
  )
}

export default AuthProvider
