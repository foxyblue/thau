import * as React from 'react'
import { UseLoginState, FetchOptions, APIError, User } from '../types'
import { AuthContextType, authContext } from '../context'
import { loginWith } from '../utils'

declare const FB: any

type Action =
  | { type: 'ERROR'; error: APIError }
  | { type: 'START_LOGIN_FLOW' }
  | { type: 'FINISH_LOGIN_FLOW'; error?: APIError; token?: string; user?: User }
  | { type: 'FACEBOOK_API_INIT_START' }
  | { type: 'FACEBOOK_API_INIT_SUCCESS' }
  | { type: 'SET_FACEBOOK_USER'; user: any }

export type LoginWithFacebookState = UseLoginState & {
  facebookUser?: any
  FacebookAPIInitialized: boolean
}

const initialState = {
  loading: false,
  error: null,
  token: null,
  user: null,
  FacebookAPIInitialized: false,
}

const reducer: React.Reducer<LoginWithFacebookState, Action> = (
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

    case 'FINISH_LOGIN_FLOW': {
      return {
        ...state,
        loading: false,
        error: action.error || null,
        user: action.user || null,
        token: action.token || null,
      }
    }

    case 'FACEBOOK_API_INIT_START': {
      return {
        ...state,
        loading: true,
        error: null,
        FacebookAPIInitialized: true,
      }
    }

    case 'FACEBOOK_API_INIT_SUCCESS': {
      return {
        ...state,
        loading: false,
        error: null,
        FacebookAPIInitialized: true,
      }
    }

    case 'SET_FACEBOOK_USER': {
      return {
        ...state,
        facebookUser: action.user,
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

const initFacebookAPI = (
  auth: AuthContextType,
  dispatch: (action: Action) => void
) => () => {
  if (typeof FB === 'undefined') {
    setTimeout(initFacebookAPI(auth, dispatch), 50)
    return
  }

  FB.getLoginStatus((status: any) => {
    if (status.status === 'connected') {
      dispatch({ type: 'SET_FACEBOOK_USER', user: status.authResponse })
    }

    dispatch({ type: 'FACEBOOK_API_INIT_SUCCESS' })
  })
}

export type UseLoginWithFacebookArgs = {
  fetchOptions?: FetchOptions
}

const useLoginWithFacebook: (
  params?: UseLoginWithFacebookArgs
) => [UseLoginState, () => void] = (params = {}) => {
  const auth = React.useContext(authContext)
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    if (!auth.loading && !state.error && !auth.facebook) {
      dispatch({
        type: 'ERROR',
        error: new APIError('No facebook id provided'),
      })
    }

    if (!auth.loading && auth.google && !state.FacebookAPIInitialized) {
      dispatch({ type: 'FACEBOOK_API_INIT_START' })
      setTimeout(initFacebookAPI(auth, dispatch), 50)
    }
  }, [auth, state])

  const continueLoginFlowWithFacecbookUser = async (facebookUser: any) => {
    const data = {
      accessToken: facebookUser.accessToken,
      userID: facebookUser.userID,
    }

    try {
      const { token, user } = await loginWith(
        'facebook',
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

    if (!state.facebookUser) {
      FB.login((response: any) => {
        dispatch({ type: 'SET_FACEBOOK_USER', user: response.authResponse })
        continueLoginFlowWithFacecbookUser(response.authResponse)
      })
    } else {
      continueLoginFlowWithFacecbookUser(state.facebookUser)
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

export default useLoginWithFacebook
