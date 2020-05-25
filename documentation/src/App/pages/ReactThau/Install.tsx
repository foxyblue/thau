import * as React from 'react'
import { Text, Code, Link, Spacer, Snippet } from '@zeit-ui/react'
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

const USE_USER_EXAMPLE = `
import * as React from 'react'
import { useUser, useCurrentProvider } from 'react-thau'

const App = () => {
  const user = useUser()
  const provider = useCurrentProvider()

  if (!user) {
    return null
  }

  return (
    <p>User {user.email} is logged in using {provider} strategy</p>
  )
}
`.trim()

export default () => (
  <Section>
    <Text h1>
      React Thau: Install and Run
    </Text>
    <Text p>
      Firstly, install <Code>react-thau</Code> package:
    </Text>
    <Snippet text="npm install react-thau" />
    <Text p>
      Then wrap your application by a <Code><Link color href="#react-thau-provider">AuthProvider</Link></Code>:
    </Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {WRAPPER_CODE}
    </SyntaxHighlighter>
    <Text p>
      And now you can use react-thau hooks inside your application. Example:
    </Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {USE_USER_EXAMPLE}
    </SyntaxHighlighter>
    <Spacer />
    <Link block href="#react-thau-provider">
      Next: AuthProvider
    </Link>
  </Section>
)