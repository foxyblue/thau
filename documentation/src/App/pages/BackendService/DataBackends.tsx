import * as React from 'react'
import { Text, Link, Spacer, Radio, Tabs } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const ENV_CONFIGS = {
  sqlite: {
    env: `
DATA_BACKEND=sqlite
SQLITE_FILENAME= # Filename to store the SQLite DB data. Default: "db"
    `.trim(),
    yaml: `
data_backend: sqlite
sqlite:
  filename: # Filename to store the SQLite DB data. Default: "db"
    `.trim(),
    json: `
{
  "data_backend": "sqlite",
  "sqlite": {
    "filename": // Filename to store the SQLite DB data. Default: "db"
  }
}
    `.trim(),
  },
  postgres: {
    env: `
DATA_BACKEND=postgres
PG_HOST= # Required. Postgres host
PG_PORT= # Required. Postgres port
PG_USER= # Postgres user
PG_PASSWORD= # Postgres password
PG_DATABASE= # Postgres database
PG_CONNECTION_TIMEOUT_MS= # Connection timeout in milliseconds. Default: no timeout
PG_IDLE_TIMEOUT_MS= # Connection idle timeout in milliseconds. Default: no timeout
PG_MAX_CONNECITONS= # Maximum number of connection in a pool. Default: 10
    `.trim(),
    yaml: `
data_backend: postgres
postgres:
  host: # Required. Postgres host
  port: # Required. Postgres port
  user: # Postgres user
  password: # Postgres password
  database: # Postgres database
  connectionTimeoutMillis: # Connection timeout in milliseconds. Default: no timeout
  idleTimeoutMillis: # Connection idle timeout in milliseconds. Default: no timeout
  max: # Maximum number of connection in a pool. Default: 10
    `.trim(),
    json: `
{
  "data_backend": "postgres",
  "postgres": {
    "host": // Required. Postgres host,
    "port": // Required. Postgres port,
    "user": // Postgres user,
    "password": // Postgres password,
    "database": // Postgres database,
    "connectionTimeoutMillis": // Connection timeout in milliseconds. Default: no timeout,
    "idleTimeoutMillis": // Connection idle timeout in milliseconds. Default: no timeout,
    "max": // Maximum number of connection in a pool. Default: 10,
  }
}
    `.trim(),
  },
  mongo: {
    env: `
DATA_BACKEND=mongo
MONGO_URL= # Required. URL to connect to MongoDB
MONGO_CLIENT_OPTIONS= # a JSON value with MongoClient parameters that will be passed to the client constructor. Documentation of the shape of these parameters: http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect
    `.trim(),
    yaml: `
data_backend: mongo
mongo:
  url: # Required. URL to connect to MongoDB
  <<& # MongoClient options. Shape and documentation can be found here: http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect
    `.trim(),
    json: `
{
  "data_backend": "mongo",
  "mongo": {
    "url": //Required. URL to connect to MongoDB,
    ...clientOption // MongoClient options. Shape and documentation can be found here: http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect
  }
}
    `.trim(),
  }
} as any

export default () => {
  const [dataBackend, setDataBackend] = React.useState('sqlite')

  return (
    <Section>
      <Text h1>
        Backend Service - Data backend configurations
      </Text>
      <Text p>
        As you've seen in the <Link color href="#backend-service-general-configurations">General configurations</Link> section, you can configure the data backend used by <b>Thau</b> service.
        In this section you can find how to configure each of the supported data backends.
      </Text>
      <Text p>
        Currently supported data backends:
      </Text>
      <Radio.Group useRow value={dataBackend} onChange={(val: string) => setDataBackend(val)}>
        <Radio value="sqlite">sqlite</Radio>
        <Radio value="postgres">postgres</Radio>
        <Radio value="mongo">mongo</Radio>
      </Radio.Group>
      <Spacer />
      <Tabs initialValue=".ENV">
        <Tabs.Item value=".ENV" label=".ENV">
          <SyntaxHighlighter language="bash" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {ENV_CONFIGS[dataBackend].env}
          </SyntaxHighlighter>
        </Tabs.Item>
        <Tabs.Item value="YAML" label="YAML">
          <SyntaxHighlighter language="yaml" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {ENV_CONFIGS[dataBackend].yaml}
          </SyntaxHighlighter>
        </Tabs.Item>
        <Tabs.Item value="JSON" label="JSON">
          <SyntaxHighlighter language="json" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {ENV_CONFIGS[dataBackend].json}
          </SyntaxHighlighter>
        </Tabs.Item>
      </Tabs>
      <Text p>
        For every data backend <b>Thau</b> will create required tables / collections during the starup and run a validation check. If the connection, creation of schema or validation check will fail, the service will not start up and will log the exception.
      </Text>
      <Spacer />
      <Link block href="#backend-service-login">
        Next: How to configure login strategies
      </Link>
    </Section>
  )
}