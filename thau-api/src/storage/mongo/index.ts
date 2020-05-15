import AStorage, {
  SUPPORTED_STRATEGIES,
  User,
  Credentials,
  UserTokenPair,
} from '../AStorage'
import { ObjectID, MongoClientOptions, MongoClient } from 'mongodb'

export type MongoStorageConfigs = MongoClientOptions & {
  url: string
}

export default class MongoStorage extends AStorage<ObjectID> {
  private client: MongoClient
  public constructor(
    tokenLifetime: number,
    { url, ...options }: MongoStorageConfigs
  ) {
    super(tokenLifetime)
    this.client = new MongoClient(url, options)
  }

  public async connect(): Promise<void> {
    await this.client.connect()
  }

  public async initialize(): Promise<void> {
    return
  }
  public async validate(): Promise<void> {
    return
  }

  public async createUser(
    userInfo: Omit<User<ObjectID>, 'id'>,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<ObjectID>> {
    const userInsertResult = await this.client
      .db()
      .collection('Users')
      .insertOne({
        ...userInfo,
        date_of_birth: userInfo.date_of_birth
          ? new Date(userInfo.date_of_birth)
          : userInfo.date_of_birth,
      })
    await this.client
      .db()
      .collection('UserProviders')
      .insertOne({
        user_id: userInsertResult.insertedId,
        providers: {
          [provider]: providerData,
        },
      })

    const user = await this.client
      .db()
      .collection('Users')
      .findOne({ _id: userInsertResult.insertedId })
    user.id = user._id
    delete user._id
    if (user.date_of_birth) {
      user.date_of_birth = user.date_of_birth.getTime()
    }
    return user
  }
  public async createCredentials(
    userId: ObjectID,
    email: string,
    hashedPassword: string,
    salt: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<ObjectID>> {
    const credentialsInsertResult = await this.client
      .db()
      .collection('Credentials')
      .insertOne({
        user_id: new ObjectID(userId),
        email,
        password: hashedPassword,
        salt,
        strategy,
        created: new Date(),
        updated: new Date(),
      })

    const credentials = await this.client
      .db()
      .collection('Credentials')
      .findOne({
        _id: credentialsInsertResult.insertedId,
      })

    credentials.id = credentials._id
    delete credentials._id
    return credentials
  }
  public async createToken(
    userId: ObjectID,
    token: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<UserTokenPair<ObjectID>> {
    await this.client
      .db()
      .collection('UserTokenPairs')
      .update(
        {
          user_id: new ObjectID(userId),
          strategy,
        },
        {
          revoked: true,
        }
      )

    const userTokenPairInsertResult = await this.client
      .db()
      .collection('UserTokenPairs')
      .insertOne({
        user_id: new ObjectID(userId),
        token,
        strategy,
        created: new Date(),
        lifetime: this.tokenLifetime,
        revoked: false,
      })

    const userTokenPair = await this.client
      .db()
      .collection('UserTokenPairs')
      .findOne({
        _id: userTokenPairInsertResult.insertedId,
      })

    userTokenPair.id = userTokenPair._id
    delete userTokenPair._id
    return userTokenPair
  }

  public async getCredentials(
    email: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<ObjectID>> {
    const credentials = await this.client
      .db()
      .collection('Credentials')
      .findOne({ email, strategy })
    if (!credentials) {
      return credentials
    }
    credentials.id = credentials._id
    delete credentials._id

    return credentials
  }

  public async getUserTokenPair(
    token: string
  ): Promise<UserTokenPair<ObjectID>> {
    const userTokenPair = await this.client
      .db()
      .collection('UserTokenPairs')
      .findOne({
        token,
        created: { $gt: new Date(Date.now() - this.tokenLifetime) },
        revoked: false,
      })

    if (!userTokenPair) {
      return userTokenPair
    }
    userTokenPair.id = userTokenPair._id
    delete userTokenPair._id

    return userTokenPair
  }

  public async getUserById(userId: ObjectID): Promise<User<ObjectID>> {
    const user = await this.client
      .db()
      .collection('Users')
      .findOne({ _id: new ObjectID(userId) })

    if (!user) {
      return user
    }
    user.id = user._id
    delete user._id
    if (user.date_of_birth) {
      user.date_of_birth = user.date_of_birth.getTime()
    }

    return user
  }

  public async getUserByEmail(email: string): Promise<User<ObjectID>> {
    const user = await this.client
      .db()
      .collection('Users')
      .findOne({ email })
    if (!user) {
      return user
    }
    user.id = user._id
    delete user._id
    if (user.date_of_birth) {
      user.date_of_birth = user.date_of_birth.getTime()
    }
    return user
  }
  public updateUserProviders(
    userId: ObjectID,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<ObjectID>> {
    throw new Error('updateUserProviders Method not implemented.')
  }

  public async revokeToken(token: string): Promise<void> {
    await this.client
      .db()
      .collection('UserTokenPairs')
      .findOneAndUpdate(
        {
          token,
        },
        {
          $set: {
            revoked: true,
          },
        }
      )
  }
}
