import ABroadcast, { EVENT_TYPE } from './ABroadcast'

export default class VoidBroadcast extends ABroadcast {
  public async validate(): Promise<void> {
    return
  }
  public async connect(): Promise<void> {
    return
  }
  public async publishEvent(type: EVENT_TYPE, event: any): Promise<boolean> {
    return true
  }
}
