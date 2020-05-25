import * as React from 'react'
import { Text, Link, Spacer, Note, Radio, Tabs, Snippet, Code, Description } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const ENV_CONFIGS = {
  http: {
    env: `
EVENTS_BROADCAST_CHANNEL=http
BROADCAST_HTTP_URL= # Required. Endpoint that will receive the events.
BROADCAST_HTTP_HEADERS= # a JSON value with custom headers you need to set for your HTTP webhook to be reached
    `.trim(),
    yaml: `
events_broadcast_channel: http
broadcast:
  http:
    url: # Required. Endpoint that will receive the events.
    headers: # Custom headers you need to set for your HTTP webhook to be reached
    `.trim(),
    json: `
{
  "events_broadcast_channel": "http",
  "broadcast": {
    "http": {
      "url": // Required. Endpoint that will receive the events.
      "headers": // Custom headers you need to set for your HTTP webhook to be reached
    }
  }
}
    `.trim(),
  },
  kafka: {
    env: `
EVENTS_BROADCAST_CHANNEL=kafka
BROADCAST_KAFKA_CLIENT_ID= # kafka producer client id. Default: thau-api
BROADCAST_KAFKA_BROKERS= # Required. Comma separated list of kafka brokers
BROADCAST_KAFKA_CONNECTION_TIMEOUT= # Kafka connection timeout
BROADCAST_KAFKA_REQUEST_TIMEOUT= # Kafka request timeout
BROADCAST_KAFKA_RETRY= # a JSON value for the KafkaJS Retry configuration (https://kafka.js.org/docs/configuration#retry)
BROADCAST_KAFKA_SASL= # a JSON value for the KafkaJS SASL cconfiguration (https://kafka.js.org/docs/configuration#sasl)
    `.trim(),
    yaml: `
events_broadcast_channel: kafka
broadcast:
  kafka:
    topicName: # Name of the topic to publish events. Default: thau-events
    clientId: # kafka producer client id. Default: thau-api
    brokers: # Required. List of kafka brokers
    connectionTimeout: # Kafka connection timeout
    requestTimeout: # Kafka request timeout
    retry: # KafkaJS Retry configuration (https://kafka.js.org/docs/configuration#retry)
    sasl: # KafkaJS SASL cconfiguration (https://kafka.js.org/docs/configuration#sasl)
    `.trim(),
    json: `
{
  "events_broadcast_channel": "kafka",
  "broadcast": {
    "kafka": {
      "topicName": // Name of the topic to publish events. Default: thau-events
      "clientId": // kafka producer client id. Default: thau-api
      "brokers": // Required. List of kafka brokers
      "connectionTimeout": // Kafka connection timeout
      "requestTimeout": // Kafka request timeout
      "retry": // KafkaJS Retry configuration (https://kafka.js.org/docs/configuration#retry)
      "sasl": // KafkaJS SASL cconfiguration (https://kafka.js.org/docs/configuration#sasl)
    }
  }
}
    `.trim(),
  },
} as any

export default () => {
  const [broadcastChannel, setBroadcastChannel] = React.useState('http')

  return (
    <Section>
      <Text h1>
        Backend Service - Broadcast configurations
      </Text>
      <Text p>
        <b>Thau</b> API can broadcast events to thee outside. This is done to allow you to monitor what's going on inside the auth service of your app.
      </Text>
      <Text p>
        Broadcasted events:
      </Text>
      <Spacer />
      <Description title="CREATE_NEW_USER_WITH_PASSWORD" content="New user is created with a password strategy. Payload: user id" />
      <Spacer />
      <Description title="EXCHANGE_FACEBOOK_AUTH_TOKEN_FOR_TOKEN" content="User is authenticated using facebook. Payload: user id" />
      <Spacer />
      <Description title="EXCHANGE_GOOGLE_ID_TOKEN_FOR_TOKEN" content="User is authenticated using google. Payload: user id" />
      <Spacer />
      <Description title="EXCHANGE_PASSWORD_FOR_TOKEN" content="User is authenticated using password. Payload: user id" />
      <Spacer />
      <Description title="EXCHANGE_TOKEN_FOR_USER" content="Token is exchanged for user. Payload: user id" />
      <Spacer />
      <Description title="REVOKE_TOKEN" content="Token has been revoked." />
      <Spacer />
      <Text p>
        Currently supported broadcasted channels:
      </Text>
      <Radio.Group useRow value={broadcastChannel} onChange={(val: string) => setBroadcastChannel(val)}>
        <Radio value="http">http</Radio>
        <Radio value="kafka">kafka</Radio>
      </Radio.Group>
      <Spacer />
      <Tabs initialValue=".ENV">
        <Tabs.Item value=".ENV" label=".ENV">
          <SyntaxHighlighter language="bash" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {ENV_CONFIGS[broadcastChannel].env}
          </SyntaxHighlighter>
        </Tabs.Item>
        <Tabs.Item value="YAML" label="YAML">
          <SyntaxHighlighter language="yaml" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {ENV_CONFIGS[broadcastChannel].yaml}
          </SyntaxHighlighter>
        </Tabs.Item>
        <Tabs.Item value="JSON" label="JSON">
          <SyntaxHighlighter language="json" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {ENV_CONFIGS[broadcastChannel].json}
          </SyntaxHighlighter>
        </Tabs.Item>
      </Tabs>
      <Spacer />
      <Link block href="#react-thau">
        Next: How to use <b>Thau</b> API from your React application
      </Link>
    </Section>
  )
}