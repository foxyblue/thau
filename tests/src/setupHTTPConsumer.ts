import 'mocha'
import express from 'express'
import { expect } from 'chai'
import { Server } from 'http'

let server: Server
const EVENTS = {} as any
const EXPECTED_EVENTS = {
  "CREATE_NEW_USER_WITH_PASSWORD": [
    {
      "user_id": 1
    },
    {
      "user_id": 2
    },
    {
      "user_id": 3
    },
    {
      "user_id": 4
    },
  ],
  "EXCHANGE_PASSWORD_FOR_TOKEN": [
    {
      "user_id": 3
    }
  ],
  "EXCHANGE_TOKEN_FOR_USER": [
    {
      "provider": "password",
      "user_id": 1,
    },
    {
      "provider": "password",
      "user_id": 2,
    },
    {
      "provider": "password",
      "user_id": 3,
    },
    {
      "provider": "password",
      "user_id": 3
    },
    {
      "provider": "password",
      "user_id": 4
    },
  ],
  "REVOKE_TOKEN": [
    {
      "revoked": true
    }
  ]
}

before(() => new Promise((resolve, reject) => {
  const app = express()
  app.use(express.json())
  app.post('/webhook', (req, res) => {
    const event = req.body
    if (!EVENTS[event.type]) {
      EVENTS[event.type] = []
    }
    EVENTS[event.type].push(event.event)
    res.send()
  })

  server = app.listen(parseInt(process.env.WEBHOOK_PORT as string, 10), () => resolve())
}))

after(() => new Promise((rsolve, reject) => {
  server.close(() => {
    expect(EVENTS).to.deep.equal(EXPECTED_EVENTS)
    rsolve()
  })
}))
