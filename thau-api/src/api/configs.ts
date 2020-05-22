import { Router, Request, Response } from 'express'
import { withCatch } from './utils'

const ConfigsAPI = Router()

const handleGetConfigs = async (req: Request, res: Response) => {
  const publicConfigs = {
    strategies: req.configs.supported_strategies,
  } as any

  if (req.configs.google) {
    publicConfigs.google = {
      clientId: req.configs.google.clientId,
    }
  }

  if (req.configs.facebook) {
    publicConfigs.facebook = {
      clientId: req.configs.facebook.clientId,
      graphVersion: req.configs.facebook.graphVersion,
    }
  }
  return res.send(publicConfigs)
}

ConfigsAPI.get('/', withCatch(handleGetConfigs))
export default ConfigsAPI
