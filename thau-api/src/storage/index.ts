import SQLiteStorage from './sqlite'
import MongoStorage from './mongo'
import PostgresStorage from './postgres'
import { Configs } from '../configs'

export const initStorage = async (configs: Configs) => {
  let storage
  switch (configs.data_backend) {
    case 'postgres': {
      storage = new PostgresStorage(configs.token_lifetime, configs.postgres)
      break
    }
    case 'mongo': {
      storage = new MongoStorage(configs.token_lifetime, configs.mongo)
      await storage.connect()
      break
    }
    case 'sqlite': {
      storage = new SQLiteStorage(configs.token_lifetime, configs.sqlite)
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
