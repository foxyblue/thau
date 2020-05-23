import crypto from 'crypto'
import * as dotenv from 'dotenv'

dotenv.config()

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
