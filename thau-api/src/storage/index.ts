import SQLiteStorage from './sqlite'
import MongoStorage from './mongo'
import PostgresStorage from './postgres'
import { Configs } from '../configs'

export const initStorage = async (configs: Configs) => {
  let storage
  switch (configs.data_backend) {
    case 'postgres': {
      storage = new PostgresStorage(
        configs.token_lifetime,
        configs.table_names,
        configs.postgres
      )
      break
    }
    case 'mongo': {
      storage = new MongoStorage(
        configs.token_lifetime,
        configs.table_names,
        configs.mongo
      )
      await storage.connect()
      break
    }
    case 'sqlite': {
      storage = new SQLiteStorage(
        configs.token_lifetime,
        configs.table_names,
        configs.sqlite
      )
      break
    }
    default: {
      throw new Error(`Unsupported data backend: ${configs.data_backend}`)
    }
  }

  await storage!.initialize()
  await storage!.validate()

  return storage
}
