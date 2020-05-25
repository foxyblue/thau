import * as React from 'react'
import { Text, Code, Link, Spacer, Dot } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
import { useAuth } from 'react-thau'

export default () => (
  const auth = useAuth()

  return (
    <p>{JSON.stringify(auth)}</p>
  )
)
`.trim()

const SHAPE = `
type Auth = {
  loading: boolean
  error: Error | null
  availableStrategies: string[] | null
  tokenStorage: 'cookie' | 'localStorage'
  google?: {
    clientId: string
  }
  facebook?: {
    clientId: string
    graphVersion: string
  }
  setUser: (u?: User, p?: string) => void
  user?: User
  provider?: string
}
`.trim()

export default () => (
  <Section>
    <Text h1>
      React Thau: useAuth
    </Text>
    <Text p>
      <Code>useAuth</Code> hook returns you the general configurations
    </Text>
    <Text h5>Example:</Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {EXAMPLE}
    </SyntaxHighlighter>
    <Text h5>Return object shape:</Text>
    <SyntaxHighlighter language="typescript" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {SHAPE}
    </SyntaxHighlighter>
    <Spacer />
    <Link block href="#react-thau-use-user">
      Next: useUser()
    </Link>
  </Section>
)