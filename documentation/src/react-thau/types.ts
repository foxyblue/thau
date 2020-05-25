export class APIError {
  public message: string
  public status: number
  constructor(message: string, status: number = 500) {
    this.message = message
    this.status = status
  }
}

export type User = {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
  date_of_birth?: number
  gender?: string
  picture?: string
}

export type Config = {
  strategies: string[]
  key: string
  google?: {
    clientId: string
  }
  facebook?: {
    clientId: string
    graphVersion?: string
  }
}
export type FetchOptions = Omit<RequestInit, 'body' | 'method'>

export type UseLoginState = {
  loading: boolean
  error: APIError | null
  token: string | null
  user: User | null
}
