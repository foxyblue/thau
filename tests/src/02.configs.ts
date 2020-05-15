import 'mocha'
import { expect } from 'chai'
import superagent from 'superagent'
import * as dotenv from 'dotenv'
import { NAME, BACKENDS } from './utils'

dotenv.config()

const PUBLIC_RSA_KEY = process.env.PUBLIC_RSA_KEY as string
const enables_strategies = (process.env.ENABLED_STRATEGIES as string).split(',')


describe('Configs endpoints', () => {
  for (const host of BACKENDS) {
    it(`[${NAME[host]}] Should return a valid list of enabled login strategies`, async () => {
      const res = await superagent.get(`${host}/configs`)
      expect(res.status).to.equal(200)
      expect(res.body.strategies).to.deep.equal(enables_strategies)
      expect(res.body.key).to.equal(PUBLIC_RSA_KEY)
    })
  }
})
