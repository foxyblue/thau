import NodeRSA from 'node-rsa'
import crypto from 'crypto'
import * as dotenv from 'dotenv'

dotenv.config()

let ENCRYPT = true
const key = new NodeRSA()
const PUBLIC_KEY_BASE64 = process.env.PUBLIC_RSA_KEY as string

try {
  if (!PUBLIC_KEY_BASE64) {
    throw new Error('No key provided')
  }
  key.importKey(
    Buffer.from(PUBLIC_KEY_BASE64, 'base64').toString('utf-8'),
    'public'
  )
} catch (e) {
  console.error('RUNNING IN AN UNECRYPTED MODE!!!')
  ENCRYPT = false
}

export const encrypt = (data: string) =>
  ENCRYPT ? key.encrypt(data, 'base64') : data

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
