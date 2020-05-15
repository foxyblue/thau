import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

import { initStorage } from './storage'
import TokensAPI from './api/tokens'
import UsersAPI from './api/users'
import ConfigsAPI from './api/configs'

import initConfigs from './configs'
import initCrypto from './crypto'
import AStorage from './storage/AStorage'
import generateSwaggerDocumentation from './swagger'

declare global {
  namespace Express {
    interface Request {
      storage: AStorage<any>
    }
  }
}
const main = async () => {
  const configs = initConfigs()
  const storage = await initStorage(configs)
  initCrypto(configs)

  const app = express()
  app.use((req, res, next) => {
    req.storage = storage
    return next()
  })
  app.use(helmet())
  app.use(cors())
  app.use(express.json())

  app.use('/tokens', TokensAPI)
  app.use('/users', UsersAPI)
  app.use('/configs', ConfigsAPI)

  app.get('/heartbeat', (req, res) => {
    res.send({
      service: 'auth',
      data_backend: configs.data_backend,
      status: 'OK',
    })
  })

  if (configs.swagger) {
    app.use(
      '/api-docs',
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
