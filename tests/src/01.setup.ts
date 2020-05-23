import 'mocha'
import { expect } from 'chai'
import superagent from 'superagent'
import * as dotenv from 'dotenv'
import { NAME, BACKENDS } from './utils'

dotenv.config()

describe('Services are running', () => {
  for (const host of BACKENDS) {
    it(`[${NAME[host]}]: Should get the heartbeat from instance of auth service`, async () => {
      const heartbeat = await superagent.get(`${host}/heartbeat`)
      expect(heartbeat.status).to.equal(200)
      expect(heartbeat.body.data_backend).to.equal(NAME[host].split('-')[0])
    })
  }
})
