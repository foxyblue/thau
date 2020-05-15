import 'mocha'
import { expect } from 'chai'
import superagent from 'superagent'
import * as dotenv from 'dotenv'

dotenv.config()

const sqlite = process.env.AUTH_SQLITE_HOST as string
const mongo = process.env.AUTH_MONGO_HOST as string
const postgres = process.env.AUTH_POSTGRES_HOST as string

const BACKENDS = [sqlite, mongo, postgres]
const NAME = {
  [sqlite]: 'sqlite',
  [mongo]: 'mongo',
  [postgres]: 'postgres',
} as any

describe('Services are running', () => {
  for (const host of BACKENDS) {
    it(`[${NAME[host]}]: Should get the heartbeat from instance of auth service`, async () => {
      const heartbeat = await superagent.get(`${host}/heartbeat`)
      expect(heartbeat.status).to.equal(200)
      expect(heartbeat.body.data_backend).to.equal(NAME[host])
    })
  }
})
