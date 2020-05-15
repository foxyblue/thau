import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import { configs } from '../../configs'

import { APIError } from '../utils'
import { SUPPORTED_STRATEGIES } from '../../storage/AStorage'
import { createToken } from '../tokens'

const handleExchangeGoogleForToken = async (req: Request, res: Response) => {
  if (!configs.google) {
    throw new APIError('No google client id found!', 500)
  }
  const { id_token } = req.body
  const googleClient = new OAuth2Client(configs.google.clientId)
  const ticket = await googleClient.verifyIdToken({
    idToken: id_token,
    audience: configs.google.clientId,
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

  return res.send({ token })
}

export default handleExchangeGoogleForToken
