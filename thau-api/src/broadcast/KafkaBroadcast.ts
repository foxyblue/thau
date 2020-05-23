import { Kafka, Producer, SASLOptions, RetryOptions } from 'kafkajs'
import ABroadcast from './ABroadcast'
import { ObjectId } from 'mongodb'

export type KafkaBroadcastConfigs = {
  topicName: string
  clientId: string
  brokers: string[]
  connectionTimeout?: number
  requestTimeout?: number
  retry?: RetryOptions
  sasl?: SASLOptions
}
export default class KafkaBroadcast extends ABroadcast {
  private topicName: string
  private client: Kafka
  private producer: Producer

  public constructor({ topicName, ...configs }: KafkaBroadcastConfigs) {
    super()
    this.topicName = topicName
    this.client = new Kafka(configs)
    this.producer = this.client.producer()
  }
  public async validate(): Promise<void> {
    return
  }
  public async connect(): Promise<void> {
    await this.producer.connect()
  }
  public async publishEvent(
    type: import('./ABroadcast').EVENT_TYPE,
    event: any
  ): Promise<boolean> {
    try {
      const id = new ObjectId()
      await this.producer.send({
        topic: this.topicName,
        messages: [
          {
            key: `${type}|${id.toHexString()}`,
            value: JSON.stringify(event),
          },
        ],
      })
    } catch (err) {
      console.error(err)
    }

    return true
  }
}
