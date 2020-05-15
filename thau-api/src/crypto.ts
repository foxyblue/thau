import NodeRSA from 'node-rsa'
import crypto from 'crypto'
import * as dotenv from 'dotenv'
import { Configs } from './configs'

dotenv.config()

let ENCRYPT = true
const key = new NodeRSA()

export default (configs: Configs) => {
  try {
    if (
      !configs.crypto.public_key_base64 ||
      !configs.crypto.private_key_base64
    ) {
      throw new Error('No key provided')
    }
    key.importKey(
      Buffer.from(configs.crypto.public_key_base64, 'base64').toString('utf-8'),
      'public'
    )
    key.importKey(
      Buffer.from(configs.crypto.private_key_base64, 'base64').toString(
        'utf-8'
      ),
      'private'
    )
  } catch (e) {
    console.error('RUNNING IN AN UNECRYPTED MODE!!!')
    ENCRYPT = false
  }
}

export const encrypt = (data: string) =>
  ENCRYPT ? key.encrypt(data, 'base64') : data
export const decrypt = (data: string) =>
  ENCRYPT ? key.decrypt(data).toString('utf-8') : data

export const generateSalt = () =>
  crypto
    .randomBytes(128)
    .toString('hex')
    .slice(0, 64)
export const hash = (str: string, salt: string) => {
  const hashContent = crypto.createHmac('sha512', salt)
  hashContent.update(str)
  return hashContent.digest('hex')
}
