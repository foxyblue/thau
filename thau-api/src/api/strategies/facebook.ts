import { Request, Response } from 'express'
// @ts-ignore
import { Facebook } from 'fb'
import { APIError } from '../utils'
import { SUPPORTED_STRATEGIES } from '../../storage/AStorage'
import { createToken } from '../tokens'
import { EVENT_TYPE } from '../../broadcast/ABroadcast'

const handleExchangeFacebookForToken = async (req: Request, res: Response) => {
  if (!req.configs.facebook) {
    throw new APIError('No facebook client id found!', 500)
  }
  const { accessToken } = req.body

  const facebookClient = new Facebook({
    appId: req.configs.facebook.clientId,
    appSecret: req.configs.facebook.clientSecret,
    version: req.configs.facebook.graphVersion,
  })
  facebookClient.setAccessToken(accessToken)
  const fbUserResponse = await facebookClient.api('/me', {
    fields: 'id,first_name,last_name,email,birthday,gender,picture.type(large)',
  })

  let user = await req.storage.getUserByEmail(fbUserResponse.email as string)
  if (!user) {
    user = await req.storage.createUser(
      {
        username: (fbUserResponse.email as string).split('@')[0],
        email: fbUserResponse.email as string,
        first_name: fbUserResponse.first_name as string,
        last_name: fbUserResponse.last_name as string,
        picture: fbUserResponse.picture as string,
      },
      SUPPORTED_STRATEGIES.facebook,
      fbUserResponse
    )
  }

  const token = await createToken(
    req.storage,
    user.id,
    SUPPORTED_STRATEGIES.facebook
  )

  req.broadcast.publishEvent(EVENT_TYPE.EXCHANGE_FACEBOOK_AUTH_TOKEN_FOR_TOKEN, { user_id: user.id })

  return res.send({ token })
}

export default handleExchangeFacebookForToken
