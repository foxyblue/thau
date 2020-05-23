import * as dotenv from 'dotenv'
import { SUPPORTED_STRATEGIES } from './storage/AStorage'
import { MongoStorageConfigs } from './storage/mongo'
import { PostgresStorageConfigs } from './storage/postgres'
import { SQLiteStorageConfigs } from './storage/sqlite'
import { SUPPORTED_BROADCAST } from './broadcast/ABroadcast'
import { HTTPBroadcastConfigs } from './broadcast/HTTPBroadcast'
import { KafkaBroadcastConfigs } from './broadcast/KafkaBroadcast'

const ENV = {
  BROADCAST_HTTP_URL: process.env.BROADCAST_HTTP_URL as string,
  BROADCAST_HTTP_HEADERS: process.env.BROADCAST_HTTP_HEADERS as string,
  BROADCAST_KAFKA_CLIENT_ID: process.env.BROADCAST_KAFKA_CLIENT_ID as string,
  BROADCAST_KAFKA_BROKERS: process.env.BROADCAST_KAFKA_BROKERS as string,
  BROADCAST_KAFKA_CONNECTION_TIMEOUT:  process.env.BROADCAST_KAFKA_CONNECTION_TIMEOUT as string,
  BROADCAST_KAFKA_REQUEST_TIMEOUT: process.env.BROADCAST_KAFKA_REQUEST_TIMEOUT as string,
  BROADCAST_KAFKA_RETRY: process.env.BROADCAST_KAFKA_RETRY as string,
  BROADCAST_KAFKA_SASL: process.env.BROADCAST_KAFKA_SASL as string,
  BROADCAST_KAFKA_TOPIC_NAME: process.env.BROADCAST_KAFKA_TOPIC_NAME as string,
  CREDENTIALS_TABLE_NAME: process.env.CREDENTIALS_TABLE_NAME as string,
  DATA_BACKEND: process.env.DATA_BACKEND as string,
  ENABLED_STRATEGIES: process.env.ENABLED_STRATEGIES as string,
  ENV: process.env.ENV as string,
  EVENTS_BROADCAST_CHANNEL: process.env.EVENTS_BROADCAST_CHANNEL as string,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID as string,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET as string,
  FACEBOOK_GRAPH_VERSION: process.env.FACEBOOK_GRAPH_VERSION as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  MONGO_CLIENT_OPTIONS: process.env.MONGO_CLIENT_OPTIONS as string,
  MONGO_URL: process.env.MONGO_URL as string,
  PG_CONNECTION_TIMEOUT_MS: process.env.PG_CONNECTION_TIMEOUT_MS as string,
  PG_DATABASE: process.env.PG_DATABASE as string,
  PG_HOST: process.env.PG_HOST as string,
  PG_IDLE_TIMEOUT_MS: process.env.PG_IDLE_TIMEOUT_MS as string,
  PG_MAX_CONNECITONS: process.env.PG_MAX_CONNECITONS as string,
  PG_PASSWORD: process.env.PG_PASSWORD as string,
  PG_PORT: process.env.PG_PORT as string,
  PG_USER: process.env.PG_USER as string,
  PORT: process.env.PORT as string,
  SQLITE_FILENAME: process.env.SQLITE_FILENAME as string,
  SQLITE_MODE: process.env.SQLITE_MODE as string,
  SWAGGER: process.env.SWAGGER as string,
  TOKEN_LIFETIME: process.env.TOKEN_LIFETIME as string,
  USER_PROVIDERS_TABLE_NAME: process.env.USER_PROVIDERS_TABLE_NAME as string,
  USER_TOKEN_PAIRS_TABLE_NAME: process.env.USER_TOKEN_PAIRS_TABLE_NAME as string,
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME as string,
}

export type TableNamesConfig = {
  users: string
  userTokenPairs: string
  credentials: string
  userProviders: string
}

export enum SUPPORTED_STORAGES {
  postgres = "postgres",
  mongo = "mongo",
  sqlite = "sqlite"
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
  data_backend: 'postgres' as SUPPORTED_STORAGES,
  table_names: {
    users: 'USERS',
    userTokenPairs: 'USER_TOKEN_PAIRS',
    credentials: 'CREDENTIALS',
    userProviders: 'USER_PROVIDERS',
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
  broadcast: {}
}

const initSupportesStrategies = () => {
  const enabledStrategies = ENV.ENABLED_STRATEGIES as string
  if (!enabledStrategies) {
    throw new Error(
      'No ENABLED_STRATEGIES env variable defined. Please, define the list of login strategies you want to use!'
    )
  }
  const supported_strategies = enabledStrategies
    .split(',')
    .map(s => s.toLowerCase())
  for (const strategy of supported_strategies) {
    if (Object.keys(SUPPORTED_STRATEGIES).indexOf(strategy) === -1) {
      const errorMessage = `Strategy ${strategy} is not supported!\nThis is the full list of supported strategies:\n${Object.keys(
        SUPPORTED_STRATEGIES
      ).join('\n')}\n`
      throw new Error(errorMessage)
    }
  }

  return supported_strategies
}

const initGoogleStrategyParams = (supported_strategies: string[]) => {
  if (
    supported_strategies.indexOf(SUPPORTED_STRATEGIES.google) !== -1
  ) {
    const google = {
      clientId: ENV.GOOGLE_CLIENT_ID as string,
    }

    if (!google.clientId) {
      throw new Error(
        'No google client id provided. Please set the env variable GOOGLE_CLIENT_ID or remove google from ENABLED_STRATEGIES'
      )
    }

    return google
  }
}

const initFacebookStrategyParams = (supported_strategies: string[]) => {
  if (
    supported_strategies.indexOf(SUPPORTED_STRATEGIES.facebook) !== -1
  ) {
    const facebook = {
      clientId: ENV.FACEBOOK_CLIENT_ID as string,
      clientSecret: ENV.FACEBOOK_CLIENT_SECRET as string,
      graphVersion: (ENV.FACEBOOK_GRAPH_VERSION as string) || 'v7.0',
    }

    if (!facebook.clientId || !facebook.clientSecret) {
      throw new Error(
        'No facebook client id or client secret provided. Please set the env variable FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET or remove facebook from ENABLED_STRATEGIES'
      )
    }

    return facebook
  }
}

const initTableNames = (defaults: TableNamesConfig) => ({
  users:
    (ENV.USERS_TABLE_NAME as string) || defaults.users,
  userTokenPairs:
    (ENV.USER_TOKEN_PAIRS_TABLE_NAME as string) ||
    defaults.userTokenPairs,
  credentials:
    (ENV.CREDENTIALS_TABLE_NAME as string) ||
    defaults.credentials,
  userProviders:
    (ENV.USER_PROVIDERS_TABLE_NAME as string) ||
    defaults.userProviders,
})

const initSQLiteParams = (defaults: SQLiteStorageConfigs) => {
  const sqlite = { ...defaults }
  sqlite.filename =
    (ENV.SQLITE_FILENAME as string) || defaults.filename
  sqlite.mode = ENV.SQLITE_MODE
    ? parseInt(ENV.SQLITE_MODE as string, 10)
    : defaults.mode

  return sqlite
}

const initMongoParams = (defaults: MongoStorageConfigs) => {
  let mongo = { ...defaults }
  mongo.url = ENV.MONGO_URL as string
  if (!mongo.url) {
    throw new Error(
      'No MONGO_URL provided when "mongo" data backend is selected'
    )
  }
  const mongoClientOptions = ENV.MONGO_CLIENT_OPTIONS as string
  if (mongoClientOptions) {
    try {
      const mongoClientOptionsParsed = JSON.parse(mongoClientOptions)
      mongo = {
        ...mongo,
        ...mongoClientOptionsParsed,
      }
    } catch (err) {
      throw new Error(
        'Failed to parse MONGO_CLIENT_OPTIONS - please make sure you have a valid JSON in there!'
      )
    }
  }

  return mongo
}

const initPostgresParams = (defaults: PostgresStorageConfigs) => {
  const postgres = { ...defaults }
  postgres.host = ENV.PG_HOST as string
  if (!postgres.host) {
    throw new Error(
      'No PG_HOST provided when "postgres" data backend is selected'
    )
  }
  postgres.port = ENV.PG_PORT
    ? parseInt(ENV.PG_PORT as string, 10)
    : postgres.port
  postgres.user =
    (ENV.PG_USER as string) || defaults.user
  postgres.password =
    (ENV.PG_PASSWORD as string) || defaults.password
  postgres.database =
    (ENV.PG_DATABASE as string) || defaults.database

  postgres.connectionTimeoutMillis = ENV
    .PG_CONNECTION_TIMEOUT_MS
    ? parseInt(ENV.PG_CONNECTION_TIMEOUT_MS as string, 10)
    : defaults.connectionTimeoutMillis
  postgres.idleTimeoutMillis = ENV.PG_IDLE_TIMEOUT_MS
    ? parseInt(ENV.PG_IDLE_TIMEOUT_MS as string, 10)
    : defaults.idleTimeoutMillis
  postgres.max = ENV.PG_MAX_CONNECITONS
    ? parseInt(ENV.PG_MAX_CONNECITONS as string, 10)
    : defaults.max

  return postgres
}

const initHTTPBroadcastParams = () => {
  const http = {} as HTTPBroadcastConfigs
  http.url = ENV.BROADCAST_HTTP_URL
  if (!http.url) {
    throw new Error(
      'No BROADCAST_HTTP_URL provided when "http" broadcast channel is selected'
    )
  }
  if (ENV.BROADCAST_HTTP_HEADERS) {
    try {
      http.headers = JSON.parse(ENV.BROADCAST_HTTP_HEADERS)
    } catch (err) {
      throw new Error(
        'Failed to parse BROADCAST_HTTP_HEADERS - please make sure you have a valid JSON in there!'
      )
    }
  }

  return http
}

const initKafkaBroadcastParams = () => {
  const kafka = {} as KafkaBroadcastConfigs
  kafka.clientId = ENV.BROADCAST_KAFKA_CLIENT_ID || 'thau-api'
  if (!ENV.BROADCAST_KAFKA_BROKERS) {
    throw new Error('No BROADCAST_KAFKA_BROKERS provided when "kafka" broadcast channel is selected')
  }
  kafka.brokers = ENV.BROADCAST_KAFKA_BROKERS.split(',')
  kafka.connectionTimeout = ENV.BROADCAST_KAFKA_CONNECTION_TIMEOUT ? parseInt(ENV.BROADCAST_KAFKA_CONNECTION_TIMEOUT as string, 10) : undefined
  kafka.requestTimeout = ENV.BROADCAST_KAFKA_REQUEST_TIMEOUT ? parseInt(ENV.BROADCAST_KAFKA_REQUEST_TIMEOUT as string, 10) : undefined
  if (ENV.BROADCAST_KAFKA_RETRY) {
    try {
      kafka.retry = JSON.parse(ENV.BROADCAST_KAFKA_RETRY)
    } catch (err) {
      throw new Error(
        'Failed to parse BROADCAST_KAFKA_RETRY - please make sure you have a valid JSON in there!'
      )
    }
  }

  if (ENV.BROADCAST_KAFKA_SASL) {
    try {
      kafka.sasl = JSON.parse(ENV.BROADCAST_KAFKA_SASL)
    } catch (err) {
      throw new Error(
        'Failed to parse BROADCAST_KAFKA_SASL - please make sure you have a valid JSON in there!'
      )
    }
  }
  return kafka
}

const initConfigs = () => {
  dotenv.config()
  const configs = {} as Configs
  configs.env = (ENV.ENV as string) || defaultConfigs.env
  configs.swagger = Boolean(ENV.SWAGGER)
  configs.port = (ENV.PORT as string)
    ? parseInt(ENV.PORT as string, 10)
    : defaultConfigs.port
  configs.token_lifetime = ENV.TOKEN_LIFETIME
    ? parseInt(ENV.TOKEN_LIFETIME as string, 10)
    : defaultConfigs.token_lifetime
  configs.data_backend = ENV.DATA_BACKEND as SUPPORTED_STORAGES
  configs.eventsBroadcastChannel = ENV.EVENTS_BROADCAST_CHANNEL as SUPPORTED_BROADCAST

  configs.supported_strategies = initSupportesStrategies()
  configs.google = initGoogleStrategyParams(defaultConfigs.supported_strategies)
  configs.facebook = initFacebookStrategyParams(defaultConfigs.supported_strategies)
  configs.table_names = initTableNames(defaultConfigs.table_names)

  switch (configs.data_backend) {
    case 'sqlite': {
      configs.sqlite = initSQLiteParams(defaultConfigs.sqlite)
      break
    }
    case 'mongo': {
      configs.mongo = initMongoParams(defaultConfigs.mongo)
      break
    }
    case 'postgres': {
      configs.postgres = initPostgresParams(defaultConfigs.postgres)
      break
    }
  }

  if (configs.eventsBroadcastChannel) {
    configs.broadcast = {}
    switch (configs.eventsBroadcastChannel) {
      case 'http': {
        configs.broadcast.http = initHTTPBroadcastParams()
        break;
      }
      case 'kafka': {
        configs.broadcast.kafka = initKafkaBroadcastParams()
        configs.broadcast.kafka.topicName = ENV.BROADCAST_KAFKA_TOPIC_NAME || 'thau-kafka-broadcast'
        break;
      }
    }
  }

  return configs
}

export default initConfigs