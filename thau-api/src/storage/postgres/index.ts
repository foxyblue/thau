import { Pool } from 'pg'
import AStorage, {
  User,
  SUPPORTED_STRATEGIES,
  Credentials,
  UserTokenPair,
} from '../AStorage'
import createSchema from './createSchema'
import { configs } from '../../configs'

export type PostgresStorageConfigs = {
  host: string
  user?: string
  password?: string
  database?: string
  port?: number
  connectionTimeoutMillis?: number
  idleTimeoutMillis?: number
  max?: number
}

export default class PostgresStorage extends AStorage<number> {
  private pool: Pool
  public constructor(
    tokenLifetime: number,
    tableNames: typeof configs.table_names,
    pgConfigs: PostgresStorageConfigs
  ) {
    super(tokenLifetime, tableNames)
    this.pool = new Pool(pgConfigs)
  }

  public async initialize(): Promise<void> {
    const client = await this.pool.connect()
    await createSchema(client)
    client.release()
  }
  public async validate(): Promise<void> {
    const client = await this.pool.connect()
    client.query(`SELECT * FROM ${this.tableNames.users}`)
    client.query(`SELECT * FROM ${this.tableNames.userTokenPairs}`)
    client.query(`SELECT * FROM ${this.tableNames.credentials}`)
    client.query(`SELECT * FROM ${this.tableNames.userProviders}`)
    client.release()
  }
  public async connect(): Promise<void> {
    return
  }

  public async createUser(
    userInfo: Omit<User<number>, 'id'>,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<number>> {
    const client = await this.pool.connect()
    await client.query('BEGIN')
    try {
      const insertRes = await client.query(
        `
        INSERT INTO ${this.tableNames.users} (
          email,
          username,
          first_name,
          last_name,
          date_of_birth,
          gender,
          picture
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          TO_TIMESTAMP($5::BIGINT), 
          $6,
          $7
        )
        RETURNING
          id,
          email,
          username,
          first_name,
          last_name,
          extract(epoch from date_of_birth) as date_of_birth,
          gender,
          picture
        ;
      `,
        [
          userInfo.email,
          userInfo.username,
          userInfo.first_name,
          userInfo.last_name,
          userInfo.date_of_birth,
          userInfo.gender,
          userInfo.picture,
        ]
      )
      const newUser = insertRes.rows[0]

      await client.query(
        `
        INSERT INTO ${this.tableNames.userProviders} (
          user_id,
          provider,
          data
        ) VALUES ($1, $2, $3)
        RETURNING *;
      `,
        [newUser.id, provider, JSON.stringify(providerData)]
      )

      await client.query('COMMIT')
      client.release()

      return newUser
    } catch (e) {
      await client.query('ROLLBACK')
      client.release()
      throw e
    }
  }

  public async createCredentials(
    userId: number,
    email: string,
    hashedPassword: string,
    salt: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<number>> {
    const client = await this.pool.connect()
    const insertRes = await client.query(
      `
      INSERT INTO ${this.tableNames.credentials} (
        user_id,
        email,
        password,
        salt,
        strategy
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [userId, email, hashedPassword, salt, strategy]
    )
    const credentials = insertRes.rows[0]
    client.release()
    return credentials
  }

  public async createToken(
    userId: number,
    token: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<UserTokenPair<number>> {
    const client = await this.pool.connect()
    await client.query(
      `
      UPDATE ${this.tableNames.userTokenPairs}
        SET revoked = true
        WHERE user_id = $1
    `,
      [userId]
    )
    const insertRes = await client.query(
      `
      INSERT INTO ${this.tableNames.userTokenPairs} (
        user_id,
        token,
        lifetime,
        strategy
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [userId, token, this.tokenLifetime, strategy]
    )
    const userTokenPair = insertRes.rows[0]
    client.release()
    return userTokenPair
  }

  public async getCredentials(
    email: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<number>> {
    const client = await this.pool.connect()
    const res = await client.query(
      `
      SELECT * FROM ${this.tableNames.credentials} WHERE email = $1 and strategy = $2;
    `,
      [email, strategy]
    )
    const credentials = res.rows[0]
    client.release()
    return credentials
  }

  public async getUserTokenPair(token: string): Promise<UserTokenPair<number>> {
    const client = await this.pool.connect()
    const res = await client.query(
      `
      SELECT *
      FROM ${this.tableNames.userTokenPairs}
      WHERE token = $1
        AND EXTRACT(EPOCH FROM (current_timestamp - created)) <= lifetime
        AND NOT revoked;
    `,
      [token]
    )
    const userTokenPair = res.rows[0]

    client.release()
    return userTokenPair
  }

  public async getUserById(userId: number): Promise<User<number>> {
    const client = await this.pool.connect()
    const res = await client.query(
      `
      SELECT
        id,
        email,
        username,
        first_name,
        last_name,
        extract(epoch from date_of_birth) as date_of_birth,
        gender,
        picture
      FROM ${this.tableNames.users} WHERE id = $1
    `,
      [userId]
    )
    const user = res.rows[0]
    client.release()
    return user
  }
  public async getUserByEmail(email: string): Promise<User<number>> {
    const client = await this.pool.connect()
    const res = await client.query(
      `
      SELECT 
        id,
        email,
        username,
        first_name,
        last_name,
        extract(epoch from date_of_birth) as date_of_birth,
        gender,
        picture
      FROM ${this.tableNames.users} WHERE email = $1
    `,
      [email]
    )
    const user = res.rows[0]
    client.release()
    return user
  }

  public async updateUserProviders(
    userId: number,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<number>> {
    const client = await this.pool.connect()
    await client.query(
      `
      INSERT INTO ${this.tableNames.userProviders} (
        user_id,
        provider,
        data
      ) VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [userId, provider, JSON.stringify(providerData)]
    )
    const userRes = await client.query(
      `
      SELECT
        id,
        email,
        username,
        first_name,
        last_name,
        extract(epoch from date_of_birth) as date_of_birth,
        gender,
        picture
      FROM ${this.tableNames.users} WHERE id = $1
    `,
      [userId]
    )
    const user = userRes.rows[0]
    client.release()
    return user
  }

  public async revokeToken(token: string): Promise<void> {
    const client = await this.pool.connect()
    await client.query(
      `
      UPDATE ${this.tableNames.userTokenPairs}
      SET revoked = TRUE
      WHERE token = $1;
    `,
      [token]
    )
  }
}
