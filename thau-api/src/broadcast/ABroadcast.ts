export enum SUPPORTED_BROADCAST {
  http = "http",
  kafka = "kafka",
}

export enum EVENT_TYPE {
  EXCHANGE_TOKEN_FOR_USER = "EXCHANGE_TOKEN_FOR_USER",
  REVOKE_TOKEN = "REVOKE_TOKEN",
  EXCHANGE_PASSWORD_FOR_TOKEN = "EXCHANGE_PASSWORD_FOR_TOKEN",
  EXCHANGE_GOOGLE_ID_TOKEN_FOR_TOKEN = "EXCHANGE_GOOGLE_ID_TOKEN_FOR_TOKEN",
  EXCHANGE_FACEBOOK_AUTH_TOKEN_FOR_TOKEN = "EXCHANGE_FACEBOOK_AUTH_TOKEN_FOR_TOKEN",
  CREATE_NEW_USER_WITH_PASSWORD = "CREATE_NEW_USER_WITH_PASSWORD"
}

export default abstract class ABroadcast {
  public abstract async validate(): Promise<void>
  public abstract async connect(): Promise<void>
  public abstract async publishEvent(type: EVENT_TYPE, event: any): Promise<boolean>
}