import pg from 'pg'

export default async (client: pg.PoolClient) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS USERS (
      id SERIAL primary key,
      email text not null,
      username text not null,
      first_name text,
      last_name text,
      date_of_birth DATE,
      gender text,
      picture text
    );
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS USER_TOKEN_PAIRS (
      id SERIAL primary key,
      user_id integer NOT NULL,
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
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS CREDENTIALS (
      id SERIAL primary key,
      user_id integer NOT NULL,
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
  `)

  await client.query(`
    CREATE TABLE IF NOT EXISTS USER_PROVIDERS (
      id SERIAL primary key,
      user_id integer NOT NULL,
      provider text,
      data JSONB,

      FOREIGN KEY (user_id)
        REFERENCES users (id)
          ON DELETE CASCADE
          ON UPDATE NO ACTION
    );
  `)
}
