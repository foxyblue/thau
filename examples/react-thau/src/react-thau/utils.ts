import Cookies from 'js-cookie'
import { AuthContextType } from './context'
import { FetchOptions, APIError, User } from './types'

export const getToken = (tokenStorage: 'localStorage' | 'cookie') => {
  switch (tokenStorage) {
    case 'localStorage': {
      return localStorage.getItem('token') || undefined
    }
    case 'cookie': {
      return Cookies.get('token')
    }
  }
}

export const setToken = (
  tokenStorage: 'localStorage' | 'cookie',
  token?: string
) => {
  switch (tokenStorage) {
    case 'localStorage': {
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
      break
    }
    case 'cookie': {
      if (token) {
        Cookies.set('token', token)
      } else {
        Cookies.remove('token')
      }
      break
    }
  }
}

export const loginWith: (
  strategy: string,
  auth: AuthContextType,
  data: any,
  fetchOptions?: FetchOptions
) => Promise<{ token: string; user: User }> = async (
  strategy,
  auth,
  data,
  fetchOptions
) => {
  try {
    const response = await fetch(`${auth.authUrl}/tokens/${strategy}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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

      throw new APIError(errorMessage, errorStatus)
    }

    const { token } = body
    setToken(auth.tokenStorage, token)

    if (token) {
      const userResponse = await fetch(
        `${auth.authUrl}/tokens/user?token=${token}`,
        fetchOptions
      )
      if (userResponse.status !== 200) {
        setToken(auth.tokenStorage)

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
      } else {
        const { user, provider } = await userResponse.json()
        auth.setUser(user, provider)

        return { token, user }
      }
    } else {
      throw new APIError('No token returned by the server', 500)
    }
  } catch (err) {
    throw new APIError(err.message, err.status)
  }
}

export const generateFacebookInitScript = (facebook: {
  clientId: string
  graphVersion: string
}) => `
window.fbAsyncInit = function() {
  FB.init({
    appId      : '${facebook.clientId}',
    cookie     : true,                       // Enable cookies to allow the server to access the session.
    version    : '${facebook.graphVersion}'  // Use this Graph API version for this call.
  });
};


(function(d, s, id) {                        // Load the SDK asynchronously
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
`
