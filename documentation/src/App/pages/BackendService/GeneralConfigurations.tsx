import * as React from 'react'
import { Text, Link, Spacer, Tabs } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const ENV_CONFIGS = `
THAU_CONFIG= # Path to the config file. If set, all other env variablees are ignored.
ENV= # Required. Name of environment the service is running.
PORT= # Port to run service on. Default: 9000.
SWAGGER= # Flag to switch on/off swagger ui endpoint. Default - 0.
DATA_BACKEND= # Required. Data storage type. Possible values: sqlite, postgres, mongo. Find out more about this in the "How to configure data backends" section.
ENABLED_STRATEGIES= # Required. Commma-separated list of enabled login strategies. Possible values: password, google, facebook. Find out more about this in the "How to configure login strategies" section.
USERS_TABLE_NAME= # Name for the USERS table. Default: USERS
USER_TOKEN_PAIRS_TABLE_NAME= # Name for the USER_TOKEN_PAIRS table. Default: USER_TOKEN_PAIRS.
CREDENTIALS_TABLE_NAME= # Name for the CREDENTIALS table. Default: CREDENTIALS.
USER_PROVIDERS_TABLE_NAME= # Name for the USER_PROVIDERS table. Default: USER_PROVIDERS.
EVENTS_BROADCAST_CHANNEL= # Events broadcasting channel. Possible values: http, kafka. Find out more about this in the "How to configure broadcasting channels" section.  
`.trim()

const YAML_CONFIG = `
env: # Required. Name of environment the service is running.
port: # Port to run service on. Default: 9000.
swagger: # Flag to switch on/off swagger ui endpoint. Default - false
data_backend: # Required. Data storage type. Possible values: sqlite, postgres, mongo. Find out more about this in the "Data backends" section.
supported_strategies: # Required. List of enabled login strategies. Possible values: password, google, facebook. Find out more about this in the "Login strategies" section.
table_names: # Names for the tables to be used by the service.
token_lifetime: # Number of milliseconds the token is valid. Default: 10 days.
events_broadcast_channel: # Events broadcasting channel. Possible values: http, kafka. Find out more about this  in the "Broadcasting channels" section.
`.trim()

const JSON_CONFIG = `
{
  "env": , // Required. Name of environment the service is running.
  "port": , // Port to run service on. Default: 9000.
  "swagger": , // Flag to switch on/off swagger ui endpoint. Default - false
  "data_backend": , // Required. Data storage type. Possible values: sqlite, postgres, mongo. Find out more about this in the Data backends section.
  "supported_strategies": , // Required. List of enabled login strategies. Possible values: password, google, facebook. Find out more about this in the Login strategies section.
  "table_names": , // Names for the tables to be used by the service.
  "token_lifetime": , // Number of milliseconds the token is valid. Default: 10 days.
  "events_broadcast_channel": , // Events broadcasting channel. Possible values: http, kafka. Find out more about this  in the Broadcasting channels section.
}
`.trim()

export default () => (
  <Section>
    <Text h1>
      Backend Service - General configurations
    </Text>
    <Text p>
      <b>Thau</b> is configurable through environment variables or through configuration file.
      This section gives you an overview on general configuration parameters, while next sections will give you more information about some specific configurations such as data backend, login strategies or broadcasting.
    </Text>
    <Tabs initialValue=".ENV">
      <Tabs.Item value=".ENV" label=".ENV">
        <SyntaxHighlighter language="bash" style={githubGist} customStyle={{ maxHeight: 600 }}>
          {ENV_CONFIGS}
        </SyntaxHighlighter>
      </Tabs.Item>
      <Tabs.Item value="YAML"  label="YAML">
        <SyntaxHighlighter language="yaml" style={githubGist} customStyle={{ maxHeight: 600 }}>
          {YAML_CONFIG}
        </SyntaxHighlighter>
      </Tabs.Item>
      <Tabs.Item value="JSON"  label="JSON">
        <SyntaxHighlighter language="json" style={githubGist} customStyle={{ maxHeight: 600 }}>
          {JSON_CONFIG}
        </SyntaxHighlighter>
      </Tabs.Item>
    </Tabs>
    <Spacer />
    <Link block href="#backend-service-data">
      Next: How to configure data backends
    </Link>
  </Section>
)