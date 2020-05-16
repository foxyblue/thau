import { Router, Request, Response } from 'express'
import { configs } from '../configs'
import { withCatch } from './utils'

const ConfigsAPI = Router()

const handleGetConfigs = async (req: Request, res: Response) => {
  const publicConfigs = {
    strategies: configs.supported_strategies,
  } as any

  if (configs.google) {
    publicConfigs.google = {
      clientId: configs.google.clientId,
    }
  }

  if (configs.facebook) {
    publicConfigs.facebook = {
      clientId: configs.facebook.clientId,
      graphVersion: configs.facebook.graphVersion,
    }
  }
  return res.send(publicConfigs)
}

ConfigsAPI.get('/', withCatch(handleGetConfigs))
export default ConfigsAPI
