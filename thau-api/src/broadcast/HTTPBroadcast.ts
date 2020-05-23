import supreagent, { SuperAgentStatic, Request } from 'superagent'
import ABroadcast, { EVENT_TYPE } from './ABroadcast'

export type HTTPBroadcastConfigs = {
  url: string
  headers: Headers
}

export default class HTTPBroadcast extends ABroadcast {
  private url: string
  private headers: Headers
  private agent: SuperAgentStatic & Request

  public constructor({ url, headers }: HTTPBroadcastConfigs) {
    super()
    this.url = url
    this.headers = headers

    this.agent = supreagent.agent().set('Content-Type', 'application/json')
    if (this.headers) {
      this.agent.set(this.headers)
    }
  }

  public async validate(): Promise<void> {
    return
  }
  public async connect(): Promise<void> {
    return
  }
  public async publishEvent(type: EVENT_TYPE, event: any): Promise<boolean> {
    try {
      await this.agent.post(this.url).send(
        JSON.stringify({
          type,
          event,
        })
      )
      return true
    } catch (err) {
      console.warn(`Failed to broadcast ${type} event`)
      console.warn(err)
      return false
    }
  }
}
