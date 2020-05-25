import * as React from 'react'
import { UseLoginState, FetchOptions, APIError, User } from '../types'
import { AuthContextType, authContext } from '../context'
import { loginWith } from '../utils'

declare const gapi: any

type Action =
  | { type: 'ERROR'; error: APIError }
  | { type: 'START_LOGIN_FLOW' }
  | { type: 'GAPI_INIT_START' }
  | { type: 'GAPI_INIT_SUCCESS' }
  | { type: 'SET_GOOGLE_USER'; user: any }
  | { type: 'FINISH_LOGIN_FLOW'; error?: APIError; token?: string; user?: User }

export type LoginWithGoogleState = UseLoginState & {
  googleUser?: any
  GAPIInitialized: boolean
}

const initialState = {
  loading: false,
  error: null,
  token: null,
  user: null,
  GAPIInitialized: false,
}

const reducer: React.Reducer<LoginWithGoogleState, Action> = (
  state,
  action
) => {
  switch (action.type) {
    case 'START_LOGIN_FLOW': {
      return {
        ...state,
        loading: true,
        error: null,
      }
    }

    case 'GAPI_INIT_START': {
      return {
        ...state,
        loading: true,
        error: null,
        token: null,
        GAPIInitialized: true,
      }
    }

    case 'GAPI_INIT_SUCCESS': {
      return {
        ...state,
        loading: false,
        error: null,
        token: null,
        GAPIInitialized: true,
      }
    }

    case 'SET_GOOGLE_USER': {
      return {
        ...state,
        googleUser: action.user,
      }
    }

    case 'FINISH_LOGIN_FLOW': {
      return {
        ...state,
        loading: false,
        error: action.error || null,
        user: action.user || null,
        token: action.token || null,
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

    default: {
      return state
    }
  }
}

const initGAPI = (
  auth: AuthContextType,
  dispatch: (action: Action) => void
) => () => {
  if (typeof gapi === 'undefined') {
    setTimeout(initGAPI(auth, dispatch), 50)
    return
  }

  if (gapi.auth2) {
    return dispatch({ type: 'GAPI_INIT_SUCCESS' })
  }

  gapi.load('auth2', {
    callback: () => {
      gapi.auth2
        .init({
          client_id: auth.google?.clientId,
        })
        .then(() => {
          dispatch({ type: 'GAPI_INIT_SUCCESS' })
          const authInstance = gapi.auth2.getAuthInstance()
          if (authInstance.isSignedIn.get()) {
            const user = authInstance.currentUser.get()
            dispatch({ type: 'SET_GOOGLE_USER', user })
          }
        })
        .catch((e: any) => {
          dispatch({ type: 'ERROR', error: new APIError(e.details) })
        })
    },
    onerror: (e: any) => {
      dispatch({ type: 'ERROR', error: new APIError(e.details) })
    },
  })
}

export type UseLoginWithGoogleArgs = {
  fetchOptions?: FetchOptions
}

const useLoginWithGoogle: (
  params?: UseLoginWithGoogleArgs
) => [UseLoginState, () => void] = (params = {}) => {
  const auth = React.useContext(authContext)
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    if (!auth.loading && !state.error && !auth.google) {
      dispatch({ type: 'ERROR', error: new APIError('No google id provided') })
    }

    if (!auth.loading && auth.google && !state.GAPIInitialized) {
      dispatch({ type: 'GAPI_INIT_START' })
      setTimeout(initGAPI(auth, dispatch), 50)
    }
  }, [auth, state])

  const continueLoginFlowWithGoogleUser = async (googleUser: any) => {
    const data = {
      id_token: googleUser.getAuthResponse().id_token,
    }

    try {
      const { token, user } = await loginWith(
        'google',
        auth,
        data,
        params.fetchOptions
      )
      dispatch({ type: 'FINISH_LOGIN_FLOW', token, user })
    } catch (err) {
      dispatch({
        type: 'FINISH_LOGIN_FLOW',
        error: new APIError(err.message, err.status),
      })
    }
  }

  const login = () => {
    if (state.loading) {
      return
    }

    dispatch({ type: 'START_LOGIN_FLOW' })

    const authInstance = gapi.auth2.getAuthInstance()
    let googleUser: any

    if (!state.googleUser) {
      if (!authInstance.isSignedIn.get()) {
        authInstance.isSignedIn.listen((success: any) => {
          if (success) {
            const user = authInstance.currentUser.get()
            dispatch({ type: 'SET_GOOGLE_USER', user })
            continueLoginFlowWithGoogleUser(user)
          }
        })
        authInstance.signIn()
      } else {
        googleUser = authInstance.currentUser.get()
      }
    } else {
      googleUser = state.googleUser
    }

    if (googleUser) {
      continueLoginFlowWithGoogleUser(googleUser)
    }
  }

  return [
    {
      loading: state.loading,
      error: state.error,
      token: state.token,
      user: state.user,
    },
    login,
  ]
}

export default useLoginWithGoogle
