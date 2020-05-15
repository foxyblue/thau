import * as React from 'react'
import { APIError, User, FetchOptions, UseLoginState } from '../types'
import { authContext, AuthContextType } from '../context'
import { loginWith } from '../utils'

type Action =
  | { type: 'RESET' }
  | { type: 'ERROR'; error: APIError }
  | { type: 'LOGIN_SUCCESS'; token: string; user: User }

export type LoginWithPasswordCredentials = {
  email: string
  password: string
}

const initialState = {
  loading: false,
  error: null,
  token: null,
  user: null,
}

const loginWithPassword = async (
  credentials: LoginWithPasswordCredentials,
  auth: AuthContextType,
  dispatch: React.Dispatch<Action>,
  fetchOptions?: FetchOptions
) => {
  dispatch({ type: 'RESET' })
  const formattedCredentials = {
    ...credentials,
  } as typeof credentials & { password_encrypted: string }

  if (formattedCredentials.password && auth.publicKey) {
    formattedCredentials.password = auth.publicKey.encrypt(
      formattedCredentials.password,
      'base64'
    )
  }

  try {
    const { token, user } = await loginWith(
      'password',
      auth,
      formattedCredentials,
      fetchOptions
    )
    dispatch({ type: 'LOGIN_SUCCESS', token, user })
  } catch (err) {
    dispatch({
      type: 'ERROR',
      error: new APIError(err.message, err.status),
    })
  }
}

const reducer: React.Reducer<UseLoginState, Action> = (state, action) => {
  switch (action.type) {
    case 'RESET': {
      return {
        ...initialState,
      }
    }

    case 'ERROR': {
      return {
        ...state,
        loading: false,
        error: action.error,
        token: null,
      }
    }

    case 'LOGIN_SUCCESS': {
      return {
        ...state,
        loading: false,
        error: null,
        token: action.token,
        user: action.user,
      }
    }

    default: {
      return state
    }
  }
}

export type UseLoginWithPasswordArgs = {
  fetchOptions?: FetchOptions
}
const useLoginWithPassword: (
  params?: UseLoginWithPasswordArgs
) => [UseLoginState, (credentials: LoginWithPasswordCredentials) => void] = (
  params = {}
) => {
  const auth = React.useContext(authContext)
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    initialState
  )
  const publicLoginWithPassword = (
    credentials: LoginWithPasswordCredentials
  ) => {
    loginWithPassword(credentials, auth, dispatch, params.fetchOptions)
  }

  return [state, publicLoginWithPassword]
}

export default useLoginWithPassword
