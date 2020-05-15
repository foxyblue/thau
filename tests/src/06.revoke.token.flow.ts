import 'mocha'
import { expect } from 'chai'
import superagent from 'superagent'
import * as dotenv from 'dotenv'
import { encrypt } from './crypto'
import { NAME, BACKENDS } from './utils'

dotenv.config()


describe('Exchange token for user flow', () => {
  for (const host of BACKENDS) {
    let USER_TOKEN_NEW: string
    let USER_TOKEN: string
    let USER: any

    it(`[${NAME[host]}]: Should create user with valid data`, async () => {
      let res
      try {
        res = await superagent.post(`${host}/users`).send({
          email: `test.user@${host}.revoke.token.flow`,
          username: 'test',
          firstName: 'First name',
          lastName: 'Last name',
          dateOfBirth: Date.now(),
          password: encrypt('PaSsWoRd'),
        })
      } catch (err) {
        res = err.response
      } finally {
        expect(res.status).to.equal(200)
        expect(res.body.token).to.not.equal(null)
        USER_TOKEN = res.body.token
      }
    })

    it(`[${NAME[host]}]: Should exchange token for user`, async () => {
      expect(USER_TOKEN).to.not.equal(undefined)
      let res
      try {
        res = await superagent.get(`${host}/tokens/user?token=${USER_TOKEN}`)
      } catch (err) {
        res = err.response
      } finally {
        expect(res.status).to.equal(200)
        expect(res.body.user.id).to.not.equal(null)
        expect(res.body.user.email).to.equal(`test.user@${host}.revoke.token.flow`)
        USER = res.body.user
      }
    })

    it(`[${NAME[host]}]: Should revoke token for user`, async () => {
      expect(USER_TOKEN).to.not.equal(undefined)
      let res
      try {
        res = await superagent.delete(`${host}/tokens?token=${USER_TOKEN}`)
      } catch (err) {
        res = err.response
      } finally {
        expect(res.status).to.equal(200)
      }
    })

    it(`[${NAME[host]}]: Should not exchange revoked token for user`, async () => {
      expect(USER_TOKEN).to.not.equal(undefined)
      let res
      try {
        res = await superagent.get(`${host}/tokens/user?token=${USER_TOKEN}`)
      } catch (err) {
        res = err.response
      } finally {
        expect(res.status).to.equal(404)
        expect(res.body).to.deep.equal({
          message: 'No logged in user found',
          status: 404,
        })
        USER = res.body.user
      }
    })
  }
})
