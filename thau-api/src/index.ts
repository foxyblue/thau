import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import { initStorage } from './storage'
import TokensAPI from './api/tokens'
import UsersAPI from './api/users'
import ConfigsAPI from './api/configs'

import initConfigs, { Configs } from './configs'
import AStorage from './storage/AStorage'
import generateSwaggerDocumentation from './swagger'
import { initBroadcasting } from './broadcast'
import ABroadcast from './broadcast/ABroadcast'

declare global {
  namespace Express {
    interface Request {
      storage: AStorage<any>
      configs: Configs
      broadcast: ABroadcast
    }
  }
}

const main = async () => {
  const configs = initConfigs()
  const storage = await initStorage(configs)
  const broadcast = await initBroadcasting(configs)

  const app = express()
  app.use((req, res, next) => {
    req.storage = storage
    req.configs = configs
    req.broadcast = broadcast
    return next()
  })

  app.use(helmet())
  app.use(cors())
  app.use(express.json())

  app.use('/api/v1/tokens', TokensAPI)
  app.use('/api/v1/users', UsersAPI)
  app.use('/api/v1/configs', ConfigsAPI)

  app.get('/api/v1/heartbeat', (req, res) => {
    res.send({
      service: 'thau',
      data_backend: configs.data_backend,
      events_broadcast_channel: configs.events_broadcast_channel,
      supported_strattegies: configs.supported_strategies,
      status: 'OK',
    })
  })

  if (configs.swagger) {
    app.use(
      '/api/v1/docs',
      swaggerUi.serve,
      swaggerUi.setup(generateSwaggerDocumentation(configs))
    )
  }
  app.listen(configs.port, () =>
    console.warn(`Auth service started at port ${configs.port}`)
  )
}

main().catch(err => {
  console.error(err)
})
