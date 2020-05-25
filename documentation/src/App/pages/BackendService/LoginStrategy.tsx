import * as React from 'react'
import { Text, Link, Spacer, Checkbox, Tabs, Code } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'


const generateConfiguration = (format: string, strategies: string[]) => {
  switch (format) {
    case 'env': return `
ENABLED_STRATEGIES=${strategies.join(',')}
${strategies.indexOf('google') === -1 ? '' : `
GOOGLE_CLIENT_ID= # Required. Google application client ID
`.trim()}
${strategies.indexOf('facebook') === -1 ? '' : `
FACEBOOK_CLIENT_ID= # Required. Facebook application client ID 
FACEBOOK_CLIENT_SECRET= # Required. Facebook application client secret
FACEBOOK_GRAPH_VERSION= # Facebook Graph API version. Default: v7.0
`.trim()}
    `.trim()

    case 'yaml': return `
supported_strategies:
  - ${strategies.join('\n  - ')}
${strategies.indexOf('google') === -1 ? '' : `
google:
  clientId: # Required. Google application client ID
`.trim()}
${strategies.indexOf('facebook') === -1 ? '' : `
facebook:
  clientId: # Required. Facebook application client ID 
  clientSecret: # Required. Facebook application client secret
  graphVersion: # Facebook Graph API version. Default: v7.0
`.trim()}
    `.trim()

    case 'json': return `
{
  "supported_strategies": ["${strategies.join('", "')}"],
  ${strategies.indexOf('google') === -1 ? '' : `
  "google": {
    "clientId": // Required. Google application client ID
  }`.trim()}
  ${strategies.indexOf('facebook') === -1 ? '' : `
  "facebook": {
    "clientId": // Required. Facebook application client ID 
    "clientSecret": // Required. Facebook application client secret
    "graphVersion": // Facebook Graph API version. Default: v7.0
  }
  `.trim()}
}
    `.trim()
  }
}

export default () => {
  const [loginStratgies, setLoginStrategies] = React.useState(['password'])

  return (
    <Section>
      <Text h1>
        Backend Service - Login strategies configurations
      </Text>
      <Text p>
        As you've seen in the <Link color href="#backend-service-general-configurations">General configurations</Link> section, you can configure multiple login strategies used by <b>Thau</b> service.
        In this section you can find how to configure each of the supported login strategies.
      </Text>
      <Text p>
        Currently supported data strategies:
      </Text>
      <Checkbox.Group value={loginStratgies} onChange={(val: string[]) => setLoginStrategies(val)}>
        <Checkbox value="password">password</Checkbox>
        <Checkbox value="facebook">facebook</Checkbox>
        <Checkbox value="google">google</Checkbox>
      </Checkbox.Group>
      <Spacer />
      <Tabs initialValue=".ENV">
        <Tabs.Item value=".ENV" label=".ENV">
          <SyntaxHighlighter language="bash" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {generateConfiguration('env', loginStratgies)}
          </SyntaxHighlighter>
        </Tabs.Item>
        <Tabs.Item value="YAML" label="YAML">
          <SyntaxHighlighter language="yaml" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {generateConfiguration('yaml', loginStratgies)}
          </SyntaxHighlighter>
        </Tabs.Item>
        <Tabs.Item value="JSON" label="JSON">
          <SyntaxHighlighter language="json" style={githubGist} customStyle={{ maxHeight: 600 }}>
            {generateConfiguration('json', loginStratgies)}
          </SyntaxHighlighter>
        </Tabs.Item>
      </Tabs>
      <Text p>
        Independently on the used strategy, <b>Thau</b> API will exchange the credentials, specific to the strategy (like email and password for <Code>password</Code>, or <Code>auth_token</Code> for <Code>faceebok</Code>), for a token that can be exchangeed for the user against API.
      </Text>
      <Spacer />
      <Link block href="#backend-service-broadcast">
        Next: How to configure broadcasting of events
      </Link>
    </Section>
  )
}