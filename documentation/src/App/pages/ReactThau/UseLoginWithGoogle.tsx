import * as React from 'react'
import { Text, Code, Link, Spacer, Dot } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
// Here the @zeit-ui is used for simplicity of UI building
import { Button } from '@zeit-ui/react'
import { useLoginWithGoogle } from 'react-thau'

export default () => (
  const [{ loading, error }, login] = useLoginWithGoogle()
  
  return (
    <Button
      loading={loading}
      type="success"
      ghost
      onClick={() => login()}
    >
      Sing In with Google
    </Button>
  )
)
`.trim()

const ARGUMENTS = `
type UseLoginWithGoogleArgs = {
  fetchOptions?: FetchOptions
}
`.trim()

const RETURN_SHAPE = `
type UseLoginState = {
  loading: boolean
  error: APIError | null
  token: string | null
  user: User | null
}

type UseLoginWithGoogleReturnShape = [UseLoginState, () => void]
`.trim()
export default () => (
  <Section>
    <Text h1>
      React Thau: useLoginWithGoogle
    </Text>
    <Text p>
      <Code>useLoginWithGoogle</Code> hook allows you to make a user login using google.
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
    <Spacer />
    <Link block href="#react-thau-use-logout">
      Next: useLogout()
    </Link>
  </Section>
)