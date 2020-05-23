import * as dotenv from 'dotenv'

import readConfigFromEnv from './readFromEnv'
import readConfigFromFile from './readFromFile'
import { SQLiteStorageConfigs } from '../storage/sqlite'
import { MongoStorageConfigs } from '../storage/mongo'
import { PostgresStorageConfigs } from '../storage/postgres'
import { SUPPORTED_BROADCAST } from '../broadcast/ABroadcast'
import { HTTPBroadcastConfigs } from '../broadcast/HTTPBroadcast'
import { KafkaBroadcastConfigs } from '../broadcast/KafkaBroadcast'

export type TableNamesConfig = {
  users: string
  userTokenPairs: string
  credentials: string
  userProviders: string
}

export enum SUPPORTED_STORAGES {
  postgres = 'postgres',
  mongo = 'mongo',
  sqlite = 'sqlite',
}

export type Configs = {
  env: string
  swagger: boolean
  port: number
  supported_strategies: string[]
  data_backend: SUPPORTED_STORAGES
  table_names: TableNamesConfig
  token_lifetime: number

  sqlite: SQLiteStorageConfigs
  mongo: MongoStorageConfigs
  postgres: PostgresStorageConfigs

  google?: {
    clientId: string
  }
  facebook?: {
    clientId: string
    clientSecret: string
    graphVersion: string
  }

  eventsBroadcastChannel?: SUPPORTED_BROADCAST
  broadcast: {
    http?: HTTPBroadcastConfigs
    kafka?: KafkaBroadcastConfigs
  }
}

export const defaultConfigs: Configs = {
  env: 'local',
  swagger: false,
  port: 9000,
  supported_strategies: [],
  data_backend: 'sqlite' as SUPPORTED_STORAGES,
  table_names: {
    users: 'USERS',
    userTokenPairs: 'USER_TOKEN_PAIRS',
    credentials: 'CREDENTIALS',
    userProviders: 'USER_PROVIDERS',
  },
  token_lifetime: 1000 * 60 * 60 * 24 * 10,
  sqlite: {
    filename: 'db',
  },
  mongo: {
    url: '',
    useUnifiedTopology: true,
  },
  postgres: {
    host: '',
    port: 5432,
  },
  broadcast: {},
}

export default () => {
  dotenv.config()
  if (!process.env.THAU_CONFIG) {
    return readConfigFromEnv()
  }

  return readConfigFromFile(process.env.THAU_CONFIG)
}
