import { Request, Response } from 'express'

export class APIError {
  public message: string
  public status: number
  constructor(message: string, status: number = 500) {
    this.message = message
    this.status = status
  }
}

export const withCatch = (
  handler: (req: Request, res: Response) => Promise<any>
) => (req: Request, res: Response) =>
  handler(req, res).catch(e => {
    const apiError = new APIError(e.message, e.status)
    console.error(e)
    return res.status(apiError.status).send(apiError)
  })
