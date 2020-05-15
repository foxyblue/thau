import { Router, Request, Response } from 'express'
import { APIError, withCatch } from './utils'
import { generateSalt } from '../crypto'
import AStorage, { SUPPORTED_STRATEGIES } from '../storage/AStorage'
import {
  handleExchangePasswordForToken,
  handleExchangeGoogleForToken,
  handleExchangeFacebookForToken,
} from './strategies'

export const createToken = async (
  storage: AStorage<any>,
  userId: string,
  strategy: SUPPORTED_STRATEGIES
) => {
  const token = generateSalt()
  await storage.createToken(userId, token, strategy)
  return token
}

const TokensAPI = Router()

const handleExchange = async (req: Request, res: Response) => {
  const strategy = req.params.strategy as SUPPORTED_STRATEGIES

  switch (strategy) {
    case 'password': {
      return await handleExchangePasswordForToken(req, res)
    }
    case 'google': {
      return await handleExchangeGoogleForToken(req, res)
    }
    case 'facebook': {
      return await handleExchangeFacebookForToken(req, res)
    }
    default: {
      throw new APIError(`Strategy ${strategy} is not supported`, 400)
    }
  }
}

const handleExchangeTokenForUser = async (req: Request, res: Response) => {
  const token = req.query.token as string

  const userTokenPair = await req.storage.getUserTokenPair(token)

  if (!userTokenPair) {
    throw new APIError('No logged in user found', 404)
  }

  const user = await req.storage.getUserById(userTokenPair.user_id)
  if (!user) {
    throw new APIError('User not found', 401)
  }
  const provider = userTokenPair.strategy
  return res.send({ user, provider })
}

const handleRevokeToken = async (req: Request, res: Response) => {
  const token = req.query.token as string
  await req.storage.revokeToken(token)
  return res.send()
}

TokensAPI.get('/user', withCatch(handleExchangeTokenForUser))
TokensAPI.post('/:strategy', withCatch(handleExchange))
TokensAPI.delete('/', withCatch(handleRevokeToken))
export default TokensAPI
