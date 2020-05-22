import * as dotenv from 'dotenv'
import { SUPPORTED_STRATEGIES } from './storage/AStorage'
import { MongoStorageConfigs } from './storage/mongo'
import { PostgresStorageConfigs } from './storage/postgres'
import { SQLiteStorageConfigs } from './storage/sqlite'

export type Configs = {
  env: string
  swagger: boolean
  port: number
  supported_strategies: string[]
  data_backend: string
  table_names: {
    users: string
    userTokenPairs: string
    credentials: string
    userProviders: string
  }
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
}

export const configs: Configs = {
  env: 'local',
  swagger: false,
  port: 9000,
  supported_strategies: [],
  data_backend: 'postgres',
  table_names: {
    users: 'USERS',
    userTokenPairs: 'USER_TOKEN_PAIRS',
    credentials: 'CREDENTIALS',
    userProviders: 'USER_PROVIDERS'
  },
  token_lifetime: 1000 * 60 * 60 * 24 * 10,
  sqlite: {
    filename: ':memory',
  },
  mongo: {
    url: '',
    useUnifiedTopology: true,
  },
  postgres: {
    host: '',
    port: 5432,
  },
}

export default () => {
  dotenv.config()

  configs.env = (process.env.ENV as string) || configs.env
  configs.swagger = Boolean(process.env.SWAGGER)

  configs.port = (process.env.PORT as string)
    ? parseInt(process.env.PORT as string, 10)
    : configs.port

  const enabledStrategies = process.env.ENABLED_STRATEGIES as string
  if (!enabledStrategies) {
    throw new Error(
      'No ENABLED_STRATEGIES env variable defined. Please, define the list of login strategies you want to use!'
    )
  }
  configs.supported_strategies = enabledStrategies
    .split(',')
    .map(s => s.toLowerCase())
  for (const strategy of configs.supported_strategies) {
    if (Object.keys(SUPPORTED_STRATEGIES).indexOf(strategy) === -1) {
      const errorMessage = `Strategy ${strategy} is not supported!\nThis is the full list of supported strategies:\n${Object.keys(
        SUPPORTED_STRATEGIES
      ).join('\n')}\n`
      throw new Error(errorMessage)
    }
  }

  if (
    configs.supported_strategies.indexOf(SUPPORTED_STRATEGIES.google) !== -1
  ) {
    configs.google = {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
    }

    if (!configs.google.clientId) {
      throw new Error(
        'No google client id provided. Please set the env variable GOOGLE_CLIENT_ID or remove google from ENABLED_STRATEGIES'
      )
    }
  }

  if (
    configs.supported_strategies.indexOf(SUPPORTED_STRATEGIES.facebook) !== -1
  ) {
    configs.facebook = {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      graphVersion: (process.env.FACEBOOK_GRAPH_VERSION as string) || 'v7.0',
    }

    if (!configs.facebook.clientId || !configs.facebook.clientSecret) {
      throw new Error(
        'No facebook client id or client secret provided. Please set the env variable FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET or remove facebook from ENABLED_STRATEGIES'
      )
    }
  }

  configs.table_names = {
    users: process.env.USERS_TABLE_NAME as string || configs.table_names.users,
    userTokenPairs: process.env.USER_TOKEN_PAIRS_TABLE_NAME as string || configs.table_names.userTokenPairs,
    credentials: process.env.CREDENTIALS_TABLE_NAME as string || configs.table_names.credentials,
    userProviders: process.env.USER_PROVIDERS_TABLE_NAME as string || configs.table_names.userProviders,
  }
  configs.token_lifetime = process.env.TOKEN_LIFETIME
    ? parseInt(process.env.TOKEN_LIFETIME as string, 10)
    : configs.token_lifetime
  configs.data_backend = process.env.DATA_BACKEND as string

  switch (configs.data_backend) {
    case 'sqlite': {
      configs.sqlite.filename =
        (process.env.SQLITE_FILENAME as string) || configs.sqlite.filename
      configs.sqlite.mode = process.env.SQLITE_MODE
        ? parseInt(process.env.SQLITE_MODE as string, 10)
        : configs.sqlite.mode
      break
    }
    case 'mongo': {
      configs.mongo.url = process.env.MONGO_URL as string
      if (!configs.mongo.url) {
        throw new Error(
          'No MONGO_URL provided when "mongo" data backend is selected'
        )
      }
      const mongoClientOptions = process.env.MONGO_CLIENT_OPTIONS as string
      if (mongoClientOptions) {
        try {
          const mongoClientOptionsParsed = JSON.parse(mongoClientOptions)
          configs.mongo = {
            ...configs.mongo,
            ...mongoClientOptionsParsed,
          }
        } catch (err) {
          throw new Error(
            'Failed to parse MONGO_CLIENT_OPTIONS - please make sure you have a valid JSON in there!'
          )
        }
      }
      break
    }
    case 'postgres': {
      configs.postgres.host = process.env.PG_HOST as string
      if (!configs.postgres.host) {
        throw new Error(
          'No PG_HOST provided when "postgres" data backend is selected'
        )
      }
      configs.postgres.port = process.env.PG_PORT
        ? parseInt(process.env.PG_PORT as string, 10)
        : configs.postgres.port
      configs.postgres.user =
        (process.env.PG_USER as string) || configs.postgres.user
      configs.postgres.password =
        (process.env.PG_PASSWORD as string) || configs.postgres.password
      configs.postgres.database =
        (process.env.PG_DATABASE as string) || configs.postgres.database

      configs.postgres.connectionTimeoutMillis = process.env
        .PG_CONNECTION_TIMEOUT_MS
        ? parseInt(process.env.PG_CONNECTION_TIMEOUT_MS as string, 10)
        : configs.postgres.connectionTimeoutMillis
      configs.postgres.idleTimeoutMillis = process.env.PG_IDLE_TIMEOUT_MS
        ? parseInt(process.env.PG_IDLE_TIMEOUT_MS as string, 10)
        : configs.postgres.idleTimeoutMillis
      configs.postgres.max = process.env.PG_MAX_CONNECITONS
        ? parseInt(process.env.PG_MAX_CONNECITONS as string, 10)
        : configs.postgres.max
      break
    }
  }
  return configs
}
