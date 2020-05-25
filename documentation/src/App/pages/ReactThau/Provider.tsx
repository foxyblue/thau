import * as React from 'react'
import { Text, Code, Link, Spacer, Dot } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const WRAPPER_CODE = `
import * as React from 'react'
import { AuthProvider } from 'react-thau'

export default () => (
  <AuthProvider authUrl="http://localhost:9000/api/v1">
    <App />
  </AuthProvider>
)
`.trim()


export default () => (
  <Section>
    <Text h1>
      React Thau: AuthProvider
    </Text>
    <Text p>
      In order to use react-thau, you have to wrap your application with a <Code>AuthProvider</Code> component.
    </Text>
    <Text h5>Props:</Text>
    <Text p>
      <Dot /> <Code>authUrl</Code>: Required. The URL to your <b>Thau</b> API deployment.<br />
      <Dot /> <Code>tokenStorage</Code>: Configure where the token will be stored. Possible values: <Code>localStorage</Code>, <Code>cookie</Code>. Default: <Code>localStorage</Code><br />
      <Dot /> <Code>fetchOptions</Code>: Configurations object that will be passed to the initial fetch of configs.
    </Text>
    <Text h5>Example</Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {WRAPPER_CODE}
    </SyntaxHighlighter>
    <Spacer />
    <Link block href="#react-thau-use-auth">
      Next: useAuth()
    </Link>
  </Section>
)