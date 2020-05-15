import sqlite3 from 'sqlite3'

export default async (db: sqlite3.Database) =>
  new Promise((resolve, reject) => {
    const cb = (step: number) => (err: Error | null) => {
      if (err) {
        return reject(err)
      }

      if (step === 4) {
        return resolve()
      }
    }

    db.serialize(() => {
      db.run(
        `
      CREATE TABLE IF NOT EXISTS USERS (
        id integer primary key AUTOINCREMENT,
        email text not null,
        username text not null,
        first_name text,
        last_name text,
        date_of_birth TIMESTAMP,
        gender text,
        picture text
      );
    `,
        cb(1)
      )

      db.run(
        `
      CREATE TABLE IF NOT EXISTS USER_TOKEN_PAIRS (
        id integer primary key AUTOINCREMENT,
        user_id integer,
        token text,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lifetime integer,
        strategy text,
        revoked boolean DEFAULT false,

        FOREIGN KEY (user_id)
          REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
      );
    `,
        cb(2)
      )

      db.run(
        `
      CREATE TABLE IF NOT EXISTS CREDENTIALS (
        id integer primary key AUTOINCREMENT,
        user_id integer,
        email text,
        password text,
        salt text,
        strategy text,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
          REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
      );
    `,
        cb(3)
      )

      db.run(
        `
      CREATE TABLE IF NOT EXISTS USER_PROVIDERS (
        id integer primary key AUTOINCREMENT,
        user_id integer,
        provider text,
        data text,

        FOREIGN KEY (user_id)
          REFERENCES users (id)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
      );
    `,
        cb(4)
      )
    })
  })
