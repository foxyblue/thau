/* tslint:disable:no-shadowed-variable */

import sqlite3 from 'sqlite3'
import AStorage, {
  SUPPORTED_STRATEGIES,
  User,
  Credentials,
  UserTokenPair,
} from '../AStorage'
import createSchema from './createSchema'
import { TableNamesConfig } from '../../configs'

export type SQLiteStorageConfigs = {
  filename: string
  mode?: number
}
export default class SQLiteStorage extends AStorage<number> {
  private client: sqlite3.Database
  private filename: string
  private mode?: number

  public constructor(
    tokenLifetime: number,
    tableNames: TableNamesConfig,
    { filename, mode }: SQLiteStorageConfigs
  ) {
    super(tokenLifetime, tableNames)
    this.filename = filename
    this.mode = mode
    this.client = new sqlite3.Database(filename, mode)
  }

  public async connect(): Promise<void> {
    if (!this.client) {
      this.client = new sqlite3.Database(this.filename, this.mode)
    }
  }

  public async initialize(): Promise<void> {
    const db = this.client as sqlite3.Database
    await createSchema(db)
  }

  public async validate(): Promise<void> {
    const db = this.client as sqlite3.Database
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      const cb = (step: number) => (err: Error | null) => {
        if (err) {
          return reject(err)
        }

        if (step === 4) {
          return resolve()
        }
      }
      db.serialize(() => {
        db.run(`SELECT * FROM ${tableNames.users}`, cb(1))
        db.run(`SELECT * FROM ${tableNames.userTokenPairs}`, cb(2))
        db.run(`SELECT * FROM ${tableNames.credentials}`, cb(3))
        db.run(`SELECT * FROM ${tableNames.userProviders}`, cb(4))
      })
    })
  }

  public createUser(
    userInfo: Omit<User<number>, 'id'>,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<number>> {
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      const db = this.client as sqlite3.Database
      db.run(
        `
        INSERT INTO ${tableNames.users} (
          email,
          username,
          first_name,
          last_name,
          date_of_birth,
          gender,
          picture
        )
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
        [
          userInfo.email,
          userInfo.username,
          userInfo.first_name,
          userInfo.last_name,
          userInfo.date_of_birth,
          userInfo.gender,
          userInfo.picture,
        ],
        function(err) {
          if (err) {
            return reject(err)
          }

          const creatdId = this.lastID

          db.serialize(() => {
            db.run(
              `
            INSERT INTO ${tableNames.userProviders} (
              user_id,
              provider,
              data
            ) VALUES (?, ?, ?);
          `,
              [creatdId, provider, JSON.stringify(providerData)],
              err => {
                if (err) {
                  db.run(`DELETE FROM ${tableNames.users} WHERE id = ?`, [
                    creatdId,
                  ])
                  return reject(err)
                }
              }
            )

            db.get(
              `
            SELECT * FROM ${tableNames.users} WHERE id = ?;
          `,
              [creatdId],
              (err, user) => {
                if (err) {
                  return reject(err)
                }
                return resolve(user)
              }
            )
          })
        }
      )
    })
  }
  public createCredentials(
    userId: number,
    email: string,
    hashedPassword: string,
    salt: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<number>> {
    const db = this.client as sqlite3.Database
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO ${tableNames.credentials} (
          user_id,
          email,
          password,
          salt,
          strategy
        ) VALUES (?, ?, ?, ?, ?);
      `,
        [userId, email, hashedPassword, salt, strategy],
        function(err) {
          if (err) {
            return reject(err)
          }
          const createdId = this.lastID
          db.get(
            `
          SELECT * FROM ${tableNames.credentials} WHERE id = ?
        `,
            [createdId],
            (err, row) => {
              if (err) {
                return reject(err)
              }

              return resolve(row)
            }
          )
        }
      )
    })
  }
  public createToken(
    userId: number,
    token: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<UserTokenPair<number>> {
    const db = this.client as sqlite3.Database
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      db.run(
        `
        UPDATE ${tableNames.userTokenPairs}
        SET revoked = true
        WHERE user_id = ?
      `,
        [userId],
        err => {
          if (err) {
            return reject(err)
          }

          db.run(
            `
          INSERT INTO ${tableNames.userTokenPairs} (
            user_id,
            token,
            lifetime,
            strategy
          ) VALUES (?, ?, ?, ?);
        `,
            [userId, token, this.tokenLifetime, strategy],
            function(err) {
              const createdId = this.lastID
              db.get(
                `
            SELECT * FROM ${tableNames.credentials} WHERE id = ?
          `,
                [createdId],
                (err, row) => {
                  if (err) {
                    return reject(err)
                  }

                  return resolve(row)
                }
              )
            }
          )
        }
      )
    })
  }
  public getCredentials(
    email: string,
    strategy: SUPPORTED_STRATEGIES
  ): Promise<Credentials<number>> {
    const db = this.client as sqlite3.Database
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT * FROM ${tableNames.credentials} WHERE email = ? and strategy = ?;
      `,
        [email, strategy],
        (err, row) => {
          if (err) {
            return reject(err)
          }

          return resolve(row)
        }
      )
    })
  }
  public getUserTokenPair(token: string): Promise<UserTokenPair<number>> {
    const db = this.client as sqlite3.Database
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      db.get(
        `
        SELECT *
        FROM ${tableNames.userTokenPairs}
        WHERE token = ?
          AND strftime('%s', 'now') - strftime('%s', created) <= lifetime
          AND NOT revoked;
      `,
        [token],
        (err, row) => {
          if (err) {
            return reject(err)
          }

          return resolve(row)
        }
      )
    })
  }
  public getUserById(userId: number): Promise<User<number>> {
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      const db = this.client as sqlite3.Database
      db.get(
        `
        SELECT * FROM ${tableNames.users} WHERE id = ?
      `,
        [userId],
        (err, user) => {
          if (err) {
            return reject(err)
          }
          return resolve(user)
        }
      )
    })
  }
  public getUserByEmail(email: string): Promise<User<number>> {
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      const db = this.client as sqlite3.Database
      db.get(
        `
        SELECT * FROM ${tableNames.users} WHERE email = ?
      `,
        [email],
        (err, user) => {
          if (err) {
            return reject(err)
          }
          return resolve(user)
        }
      )
    })
  }

  public updateUserProviders(
    userId: number,
    provider: SUPPORTED_STRATEGIES,
    providerData: any
  ): Promise<User<number>> {
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      const db = this.client as sqlite3.Database
      db.run(
        `
        INSERT INTO ${tableNames.userProviders} (
          user_id,
          provider,
          data
        ) VALUES (?, ?, ?);
      `,
        [userId, provider, JSON.stringify(providerData)],
        function(err) {
          if (err) {
            return reject(err)
          }

          const createdId = this.lastID
          db.get(
            `
          SELECT * FROM ${tableNames.userProviders} WHERE id = ?;
        `,
            [createdId],
            (err, row) => {
              if (err) {
                return reject(err)
              }
              return resolve(row)
            }
          )
        }
      )
    })
  }

  public revokeToken(token: string): Promise<void> {
    const { tableNames } = this
    return new Promise((resolve, reject) => {
      const db = this.client as sqlite3.Database
      db.run(
        `
        UPDATE ${tableNames.userTokenPairs}
        SET revoked = TRUE
        WHERE token = ?;
      `,
        [token],
        function(err) {
          if (err) {
            return reject(err)
          }

          return resolve()
        }
      )
    })
  }
}
