import * as React from 'react'
import { authContext } from '../context'

const useAuth = () => {
  const auth = React.useContext(authContext)
  delete auth.publicKey
  delete auth.authUrl

  return auth
}

export default useAuth
