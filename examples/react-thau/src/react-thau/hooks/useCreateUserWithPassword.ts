import * as React from 'react'
import { authContext, AuthContextType } from '../context'
import { APIError, User, FetchOptions } from '../types'
import { setToken } from '../utils'

type Action =
  | { type: 'RESET' }
  | { type: 'ERROR'; error: APIError }
  | { type: 'SUCCESS'; token: string }

export type NewUserType = Omit<User & { password?: string }, 'id'>
export type CreateUserWithPasswordState = {
  loading: boolean
  error: APIError | null
  token: string | null
}

const initialState = {
  loading: false,
  error: null,
  token: null,
}

const createUserWithPassword = async (
  userInfo: NewUserType,
  auth: AuthContextType,
  dispatch: React.Dispatch<Action>,
  fetchOptions?: FetchOptions
) => {
  dispatch({ type: 'RESET' })
  try {
    const formattedUserInfo = {
      ...userInfo,
    } as typeof userInfo & { password_encrypted: string }

    if (
      formattedUserInfo.date_of_birth &&
      typeof formattedUserInfo.date_of_birth === 'string'
    ) {
      formattedUserInfo.date_of_birth = parseInt(
        formattedUserInfo.date_of_birth,
        10
      )
    }

    const response = await fetch(`${auth.authUrl}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedUserInfo),
      ...fetchOptions,
    })
    const body = await response.json()
    if (response.status !== 200) {
      let errorMessage: string = ''
      let errorStatus: number = 500

      if (body.status && body.message) {
        errorMessage = body.message
        errorStatus = body.status
      } else {
        errorMessage = response.statusText
        errorStatus = response.status
      }

      return dispatch({
        type: 'ERROR',
        error: new APIError(errorMessage, errorStatus),
      })
    }

    const { token } = body
    setToken(auth.tokenStorage, token)

    return dispatch({ type: 'SUCCESS', token })
  } catch (err) {
    dispatch({ type: 'ERROR', error: new APIError(err.message) })
  }
}

const reducer: React.Reducer<CreateUserWithPasswordState, Action> = (
  state,
  action
) => {
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

    case 'SUCCESS': {
      return {
        ...state,
        loading: false,
        error: null,
        token: action.token,
      }
    }

    default: {
      return state
    }
  }
}

export type UseCreateUserWithPasswordArgs = {
  fetchOptions?: FetchOptions
}
const useCreateUserWithPassword: (
  params?: UseCreateUserWithPasswordArgs
) => [CreateUserWithPasswordState, (userInfo: NewUserType) => void] = (
  params = {}
) => {
  const auth = React.useContext(authContext)
  const [state, dispatch] = React.useReducer<typeof reducer>(
    reducer,
    initialState
  )
  const publicCreateUserWithPassword = (userInfo: Omit<User, 'id'>) => {
    createUserWithPassword(userInfo, auth, dispatch, params.fetchOptions)
  }

  return [state, publicCreateUserWithPassword]
}

export default useCreateUserWithPassword
