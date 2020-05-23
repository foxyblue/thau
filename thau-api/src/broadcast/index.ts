import { Configs } from "../configs";
import HTTPBroadcast, { HTTPBroadcastConfigs } from "./HTTPBroadcast";
import VoidBroadcast from './VoidBroadcast'
import KafkaBroadcast, { KafkaBroadcastConfigs } from "./KafkaBroadcast";

export const initBroadcasting = async (configs: Configs) => {
  let broadcast

  switch (configs.eventsBroadcastChannel) {
    case 'http': {
      broadcast = new HTTPBroadcast(configs.broadcast.http as HTTPBroadcastConfigs)
      break
    }
    case 'kafka': {
      broadcast = new KafkaBroadcast(configs.broadcast.kafka as KafkaBroadcastConfigs)
      break
    }
    default: {
      broadcast = new VoidBroadcast()
    }
  }

  await broadcast.connect()
  await broadcast.validate()

  return broadcast
}