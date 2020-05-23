import { TableNamesConfig } from '../configs'

export enum SUPPORTED_STRATEGIES {
  password = 'password',
  google = 'google',
  facebook = 'facebook',
}

export type Credentials<ID> = {
  id: ID
  user_id: ID
  email: string
  password: string
  salt: string
  strategy: SUPPORTED_STRATEGIES
  created: number
  updated: number
}

export type UserTokenPair<ID> = {
  id: ID
  user_id: ID
  token: string
  created: number
  lifetime: number
  strategy: SUPPORTED_STRATEGIES
}

export type User<ID> = {
  id: ID
  email: string
  username: string
  first_name?: string
  last_name?: string
  date_of_birth?: number
  gender?: string
  picture?: string
}

export default abstract class AStorage<ID> {
  protected tokenLifetime: number
  protected tableNames: TableNamesConfig

  public constructor(tokenLifetime: number, tableNames: TableNamesConfig) {
    this.tokenLifetime = tokenLifetime
    this.tableNames = tableNames
  }

  public abstract async initialize(): Promise<void>
  public abstract async validate(): Promise<void>
  public abstract async connect(): Promise<void>

  public abstract async createUser(
    userInfo: Omit<User<ID>, 'id'>,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<ID>>
  public abstract async createCredentials(
    userId: ID,
    email: string,
    hashedPassword: string,
    salt: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<ID>>
  public abstract async createToken(
    userId: ID,
    token: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<UserTokenPair<ID>>

  public abstract async getCredentials(
    email: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<ID>>
  public abstract async getUserTokenPair(
    token: string
  ): Promise<UserTokenPair<ID>>
  public abstract async getUserById(userId: ID): Promise<User<ID>>
  public abstract async getUserByEmail(email: string): Promise<User<ID>>

  public abstract async updateUserProviders(
    userId: ID,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<ID>>

  public abstract async revokeToken(token: string): Promise<void>
}
