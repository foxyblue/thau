const sqlite = process.env.AUTH_SQLITE_HOST as string
const mongo = process.env.AUTH_MONGO_HOST as string

export const BACKENDS = [sqlite, mongo]
export const NAME = {
  [sqlite]: 'sqlite',
  [mongo]: 'mongo',
} as any
