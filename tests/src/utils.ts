const sqlite = process.env.AUTH_SQLITE_HOST as string
const mongo = process.env.AUTH_MONGO_HOST as string
const postgres = process.env.AUTH_POSTGRES_HOST as string

export const BACKENDS = [sqlite, mongo, postgres]
export const NAME = {
  [sqlite]: 'sqlite',
  [mongo]: 'mongo',
  [postgres]: 'postgres',
} as any