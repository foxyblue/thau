import * as React from 'react'
import { authContext, AuthContextType } from '../context'
import { APIError, FetchOptions } from '../types'
import { getToken, setToken } from '../utils'

const revokeToken = async (
  auth: AuthContextType,
  fetchOptions?: FetchOptions
) => {
  const token = getToken(auth.tokenStorage)
  if (!token) {
    return
  }

  try {
    const response = await fetch(`${auth.authUrl}/tokens?token=${token}`, {
      method: 'DELETE',
      ...fetchOptions,
    })

    if (response.status !== 200) {
      const body = await response.json()

      let errorMessage: string = ''
      let errorStatus: number = 500

      if (body.status && body.message) {
        errorMessage = body.message
        errorStatus = body.status
      } else {
        errorMessage = response.statusText
        errorStatus = response.status
      }

      throw new APIError(errorMessage, errorStatus)
    }

    auth.setUser()
    setToken(auth.tokenStorage)
    return
  } catch (err) {
    throw new APIError(err.message)
  }
}

export type UseLogoutArgs = {
  fetchOptions?: FetchOptions
}

export type UseLogoutState = {
  loading: boolean
  error: APIError | null
}
const useLogout: (params?: UseLogoutArgs) => [UseLogoutState, () => void] = (
  params = {}
) => {
  const auth = React.useContext(authContext)

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<APIError | null>(null)

  const logout = () => {
    setError(null)
    if (!auth.user) {
      setLoading(false)
    }
    setLoading(true)
    revokeToken(auth, params.fetchOptions)
      .then(() => {
        setLoading(false)
        setError(null)
      })
      .catch((err) => {
        setLoading(false)
        setError(err)
      })
  }

  return [{ loading, error }, logout]
}

export default useLogout
