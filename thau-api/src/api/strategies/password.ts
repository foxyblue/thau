import { Request, Response } from 'express'
import { APIError } from '../utils'
import { SUPPORTED_STRATEGIES } from '../../storage/AStorage'
import { hash } from '../../crypto'
import { createToken } from '../tokens'

const handleExchangePasswordForToken = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    const missingFields = []
    if (!email) {
      missingFields.push('email')
    }
    if (!password) {
      missingFields.push('password')
    }
    throw new APIError(
      `Some fields are missing: ${missingFields.join(', ')}`,
      400
    )
  }
  const credentials = await req.storage.getCredentials(
    email,
    SUPPORTED_STRATEGIES.password
  )

  if (!credentials) {
    throw new APIError('User not found', 404)
  }

  let clearPassword
  let hashedPassword

  try {
    clearPassword = password
    hashedPassword = hash(clearPassword, credentials.salt)
  } catch {
    throw new APIError('Password can not be decrypted', 400)
  }

  if (hashedPassword !== credentials.password) {
    throw new APIError('Wrong password', 401)
  }

  const token = await createToken(
    req.storage,
    credentials.user_id,
    SUPPORTED_STRATEGIES.password
  )

  return res.send({ token })
}

export default handleExchangePasswordForToken
