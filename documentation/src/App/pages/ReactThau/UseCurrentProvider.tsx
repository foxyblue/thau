import * as React from 'react'
import { Text, Code, Link, Spacer } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
import { useCurrentProvider } from 'react-thau'

export default () => (
  const provider = useCurrentProvider()

  return (
    <p>{provider}</p>
  )
)
`.trim()

export default () => (
  <Section>
    <Text h1>
      React Thau: useCurrentProvider
    </Text>
    <Text p>
      <Code>useCurrentProvider</Code> hook returns you the login strategy user used to log in.
    </Text>
    <Text h5>Example:</Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {EXAMPLE}
    </SyntaxHighlighter>
    <Spacer />
    <Link block href="#react-thau-use-create-user">
      Next: useCreateUserWithPassword()
    </Link>
  </Section>
)