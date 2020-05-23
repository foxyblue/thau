import { Router, Request, Response } from 'express'
import { withCatch, APIError } from './utils'
import { createToken } from './tokens'
import { generateSalt, hash } from '../crypto'
import AStorage, { SUPPORTED_STRATEGIES, User } from '../storage/AStorage'
import { EVENT_TYPE } from '../broadcast/ABroadcast'

export const createUser = async (
  storage: AStorage<any>,
  provider: SUPPORTED_STRATEGIES,
  userInfo: Omit<User<any>, 'id'>,
  providerData: any
) => {
  let user = await storage.getUserByEmail(userInfo.email)

  if (user) {
    user = await storage.updateUserProviders(user.id, provider, providerData)
  } else {
    user = await storage.createUser(userInfo, provider, providerData)
  }

  return user
}

const UsersAPI = Router()

const handleCreateUser = async (req: Request, res: Response) => {
  const userInfo = {
    email: req.body.email,
    username: req.body.username,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    date_of_birth: req.body.dateOfBirth,
    gender: req.body.gender,
    picture: req.body.picture,
  } as Omit<User<any>, 'id'>

  if (!userInfo.email || !userInfo.username || !req.body.password) {
    const missingFields = []
    if (!userInfo.email) {
      missingFields.push('email')
    }
    if (!userInfo.username) {
      missingFields.push('username')
    }
    if (!req.body.password) {
      missingFields.push('password')
    }
    throw new APIError(
      `Some fields are missing: ${missingFields.join(', ')}`,
      400
    )
  }

  let clearPassword
  let salt
  let hashedPassword

  try {
    clearPassword = req.body.password
    salt = generateSalt()
    hashedPassword = hash(clearPassword, salt)
  } catch {
    throw new APIError('Password can not be decrypted', 400)
  }

  const existingUser = await req.storage.getUserByEmail(userInfo.email)
  if (existingUser) {
    throw new APIError('User with provided email already registered', 400)
  }

  const user = await createUser(
    req.storage,
    SUPPORTED_STRATEGIES.password,
    userInfo,
    userInfo
  )
  await req.storage.createCredentials(
    user.id,
    userInfo.email,
    hashedPassword,
    salt,
    SUPPORTED_STRATEGIES.password
  )
  const token = await createToken(
    req.storage,
    user.id,
    SUPPORTED_STRATEGIES.password
  )

  req.broadcast.publishEvent(EVENT_TYPE.CREATE_NEW_USER_WITH_PASSWORD, { user_id: user.id })
  return res.send({ token })
}

const handleGetUserById = async (req: Request, res: Response) => {
  const id = req.params.id
  const user = await req.storage.getUserById(id)
  if (!user) {
    throw new APIError('No user found', 404)
  }

  return res.send(user)
}

UsersAPI.get('/:id', withCatch(handleGetUserById))
UsersAPI.post('/', withCatch(handleCreateUser))
export default UsersAPI
