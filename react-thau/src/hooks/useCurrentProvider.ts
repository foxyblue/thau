import * as React from 'react'
import { authContext } from '../context'

const useUser = () => {
  const auth = React.useContext(authContext)
  return auth.provider
}

export default useUser
