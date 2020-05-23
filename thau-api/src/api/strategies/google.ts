import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'

import { APIError } from '../utils'
import { SUPPORTED_STRATEGIES } from '../../storage/AStorage'
import { createToken } from '../tokens'
import { EVENT_TYPE } from '../../broadcast/ABroadcast'

const handleExchangeGoogleForToken = async (req: Request, res: Response) => {
  if (!req.configs.google) {
    throw new APIError('No google client id found!', 500)
  }
  const { id_token } = req.body
  const googleClient = new OAuth2Client(req.configs.google.clientId)
  const ticket = await googleClient.verifyIdToken({
    idToken: id_token,
    audience: req.configs.google.clientId,
  })
  const payload = ticket.getPayload()
  if (!payload) {
    throw new APIError('Wrong ID token provided', 500)
  }

  let user = await req.storage.getUserByEmail(payload.email as string)
  if (!user) {
    user = await req.storage.createUser(
      {
        username: (payload.email as string).split('@')[0],
        email: payload.email as string,
        first_name: payload.given_name as string,
        last_name: payload.family_name as string,
        picture: payload.picture as string,
      },
      SUPPORTED_STRATEGIES.google,
      payload
    )
  }

  const token = await createToken(
    req.storage,
    user.id,
    SUPPORTED_STRATEGIES.google
  )
  req.broadcast.publishEvent(EVENT_TYPE.EXCHANGE_GOOGLE_ID_TOKEN_FOR_TOKEN, { user_id: user.id })

  return res.send({ token })
}

export default handleExchangeGoogleForToken
