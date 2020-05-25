import * as React from 'react'
import { User } from './types'

export type AuthContextType = {
  loading: boolean
  error: Error | null
  availableStrategies: string[] | null
  tokenStorage: 'cookie' | 'localStorage'
  google?: {
    clientId: string
  }
  facebook?: {
    clientId: string
    graphVersion: string
  }
  setUser: (u?: User, p?: string) => void
  user?: User
  provider?: string
  authUrl?: string
}

export const authContext = React.createContext<AuthContextType>({
  loading: false,
  error: null,
  availableStrategies: null,
  tokenStorage: 'localStorage',
  setUser: () => {},
})
