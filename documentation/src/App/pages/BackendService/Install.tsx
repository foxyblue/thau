import * as React from 'react'
import { Text, Link, Spacer, Tabs, Snippet, Code } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const ENV_CONFIG = `
ENV=local
SWAGGER=1
ENABLED_STRATEGIES=password
DATA_BACKEND=sqlite
`.trim()
const JSON_CONFIG = `
{
  "env": "local",
  "swagger": true,
  "supported_strategies": ["password"],
  "data_backend": "sqlite"
}
`.trim()
const YALM_CONFIG = `
env: local
swagger: true
data_backend:
  - password
data_backend: sqlite
`.trim()

const HEARTBEAT = `
{
  service: "thau",
  data_backend: "sqlite",
  supported_strattegies: ["password"],
  status: "OK"
}
`.trim()
export default () => (
  <Section>
    <Text h1>
      Backend Service - Install and Run
    </Text>
    <Tabs initialValue="1">
      <Tabs.Item label="Docker" value="1">
        <Snippet
          style={{ overflowX: 'auto' }}
          copy="prevent"
          text={'docker run -p 9000:9000 --env-file .env mgrin/thau:latest'}
        />
      </Tabs.Item>
      <Tabs.Item label="Node.js" value="2">
        <Snippet
          style={{ overflowX: 'auto' }}
          copy="prevent"
          text={['git pull https://github.com/MGrin/thau.git', 'cd thau/thau-api', 'yarn', 'yarn build', 'yarn start']}
        />
      </Tabs.Item>
    </Tabs>
    <Text p>
      In both cases we use <Code>.env</Code> file to configure the service (in case of Node.js run example, it's done implicitely).
      {' '}We can also create configuration file instead of using env variables, in this case you'll need to pass only one env variable <Code>THAU_CONFIG</Code> with the path to the config file
    </Text>
    <Tabs initialValue="0">
      <Tabs.Item label=".ENV" value="0">
        <SyntaxHighlighter language="bash" style={githubGist} customStyle={{ maxHeight: 600 }}>
          {ENV_CONFIG}
        </SyntaxHighlighter>
      </Tabs.Item>
      <Tabs.Item label="YAML" value="1">
        <SyntaxHighlighter language="yaml" style={githubGist} customStyle={{ maxHeight: 600 }}>
          {YALM_CONFIG}
        </SyntaxHighlighter>
      </Tabs.Item>
      <Tabs.Item label="JSON" value="2">
        <SyntaxHighlighter language="json" style={githubGist} customStyle={{ maxHeight: 600 }}>
          {JSON_CONFIG}
        </SyntaxHighlighter>
      </Tabs.Item>
    </Tabs>
    <Spacer />
    <Text p>
      You can cheeck if your service is running properly by getting its heartbeat:
    </Text>
    <Snippet
      style={{ overflowX: 'auto' }}
      copy="prevent"
      text="curl localhost:9000/api/v1/heartbeat"
    />
    <SyntaxHighlighter language="json" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {HEARTBEAT}
    </SyntaxHighlighter>
    <Text p>
      Also, you can see the Swaggere documentation at <Code><Link color href="http://localhost:9000/api/v1/docs">http://localhost:9000/api/v1/docs</Link></Code>
    </Text>
    <Spacer />
    <Link block href="#backend-service-general-configurations">
      Next: How to configure the service
    </Link>
  </Section>
)