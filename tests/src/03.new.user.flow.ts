import 'mocha'
import { expect } from 'chai'
import superagent from 'superagent'
import * as dotenv from 'dotenv'
import { encrypt } from './crypto'

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

describe('Create user', () => {
  for (const host of BACKENDS) {
    let USER_TOKEN: string
    let USER: any
    const DOB = new Date()

    it(`[${NAME[host]}]: Should not create user without email`, async () => {
      let res
      try {
        res = await superagent.post(`${host}/users`).send({})
      } catch (err) {
        res = err
      } finally {
        expect(res.status).to.equal(400)
        expect(res.response.body).to.deep.equal({
          message: 'Some fields are missing: email, username, password',
          status: 400,
        })
      }
    })

    it(`[${NAME[host]}]: Should not create user without username`, async () => {
      let res
      try {
        res = await superagent.post(`${host}/users`).send({
          email: 'test.test@test.test',
        })
      } catch (err) {
        res = err
      } finally {
        expect(res.status).to.equal(400)
        expect(res.response.body).to.deep.equal({
          message: 'Some fields are missing: username, password',
          status: 400,
        })
      }
    })

    it(`[${NAME[host]}]: Should not create user without password`, async () => {
      let res
      try {
        res = await superagent.post(`${host}/users`).send({
          email: 'test.test@test.test',
          username: 'test',
        })
      } catch (err) {
        res = err
      } finally {
        expect(res.status).to.equal(400)
        expect(res.response.body).to.deep.equal({
          message: 'Some fields are missing: password',
          status: 400,
        })
      }
    })

    it(`[${NAME[host]}]: Should not create user with wrongly encrypted password`, async () => {
      let res
      try {
        res = await superagent.post(`${host}/users`).send({
          email: 'test.test@test.test',
          username: 'test',
          password: 'asd',
        })
      } catch (err) {
        res = err
      } finally {
        expect(res.status).to.equal(400)
        expect(res.response.body).to.deep.equal({
          message: 'Password can not be decrypted',
          status: 400,
        })
      }
    })

    it.skip(`[${NAME[host]}]: Should not create user with wrong password`, async () => {
      const passwords = ['short']
      for (const password of passwords) {
        let res
        try {
          res = await superagent.post(`${host}/users`).send({
            email: 'test.test@test.test',
            username: 'test',
            password: encrypt(password),
          })
        } catch (err) {
          res = err
        } finally {
          expect(res.status).to.equal(400)
          expect(res.response.body).to.deep.equal({
            message: 'Password is too short, should be minimum of length 6',
            status: 400,
          })
        }
      }
    })

    it(`[${NAME[host]}]: Should create user with valid data`, async () => {
      let res
      try {
        res = await superagent.post(`${host}/users`).send({
          email: `test.user@${host}.new.user.flow`,
          username: 'test',
          firstName: 'First name',
          lastName: 'Last name',
          dateOfBirth: DOB.getTime(),
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
        expect(res.body.user.email).to.equal(`test.user@${host}.new.user.flow`)

        const dob = new Date(res.body.user.date_of_birth)
        expect(dob.getFullYear()).to.equal(DOB.getFullYear())
        expect(dob.getDate()).to.equal(DOB.getDate())
        expect(dob.getMonth()).to.equal(DOB.getMonth())
        USER = res.body.user
      }
    })

    it(`[${NAME[host]}]: Should get user by id`, async () => {
      expect(USER).to.not.equal(undefined)

      let res
      try {
        res = await superagent.get(`${host}/users/${USER.id}`)
      } catch (err) {
        res = err.response
      } finally {
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(USER)
      }
    })

    it(`[${NAME[host]}]:Should not create user with same email twice`, async () => {
      expect(USER).to.not.equal(undefined)
      let res
      try {
        res = await superagent.post(`${host}/users`).send({
          email: `test.user@${host}.new.user.flow`,
          username: 'test',
          firstName: 'First name',
          lastName: 'Last name',
          dateOfBirth: Date.now(),
          password: encrypt('PaSsWoRd'),
        })
      } catch (err) {
        res = err.response
      } finally {
        expect(res.status).to.equal(400)
        expect(res.body).to.deep.equal({
          message: 'User with provided email already registered',
          status: 400,
        })
      }

      try {
        res = await superagent.get(`${host}/users/${USER.id}`)
      } catch (err) {
        res = err.response
      } finally {
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(USER)
      }
    })
  }
})
