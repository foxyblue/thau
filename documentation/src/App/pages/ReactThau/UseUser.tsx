import * as React from 'react'
import { Text, Code, Link, Spacer } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
import { useUser } from 'react-thau'

export default () => (
  const user = useUser()

  return (
    <p>{JSON.stringify(user)}</p>
  )
)
`.trim()

const SHAPE = `
type User = {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
  date_of_birth?: number
  gender?: string
  picture?: string
}
`.trim()

export default () => (
  <Section>
    <Text h1>
      React Thau: useUser
    </Text>
    <Text p>
      <Code>useUser</Code> hook returns you the logged in user or undefined if no user is logged in
    </Text>
    <Text h5>Example:</Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {EXAMPLE}
    </SyntaxHighlighter>
    <Text h5>User object shape:</Text>
    <SyntaxHighlighter language="typescript" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {SHAPE}
    </SyntaxHighlighter>
    <Spacer />
    <Link block href="#react-thau-use-provider">
      Next: useCurrentProvider()
    </Link>
  </Section>
)