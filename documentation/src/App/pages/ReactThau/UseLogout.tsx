import * as React from 'react'
import { Text, Code, Link, Spacer, Dot } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
// Here the @zeit-ui is used for simplicity of UI building
import { Button } from '@zeit-ui/react'
import { useLogout } from 'react-thau'

export default () => (
  const [{ loading, error }, logout] = useLogout()
  
  return (
    <Button
      loading={loading}
      type="success"
      ghost
      onClick={() => logout()}
    >
      Sing Out
    </Button>
  )
)
`.trim()

const ARGUMENTS = `
type UseLogoutArgs = {
  fetchOptions?: FetchOptions
}
`.trim()

const RETURN_SHAPE = `
type UseLogoutState = {
  loading: boolean
  error: APIError | null
}

type UseLogoutReturnShape = [UseLogoutState, () => void]
`.trim()
export default () => (
  <Section>
    <Text h1>
      React Thau: useLogout
    </Text>
    <Text p>
      <Code>useLogout</Code> hook allows you to logout a user.
    </Text>
    <Text h5>Arguments:</Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {ARGUMENTS}
    </SyntaxHighlighter>
    <Text h5>Return shape:</Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {RETURN_SHAPE}
    </SyntaxHighlighter>
    <Text h5>Example:</Text>
    <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
      {EXAMPLE}
    </SyntaxHighlighter>
  </Section>
)