import * as React from 'react'
import { Text, Code, Link, Spacer } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
// Here the @zeit-ui is used for simplicity of UI building
import { Button } from '@zeit-ui/react'
import { useLoginWithFacebook } from 'react-thau'

export default () => (
  const [{ loading, error }, login] = useLoginWithFacebook()
  
  return (
    <Button
      loading={loading}
      type="success"
      ghost
      onClick={() => login()}
    >
      Sing In with Facebook
    </Button>
  )
)
`.trim()

const ARGUMENTS = `
type UseLoginWithFacebookArgs = {
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

type UseLoginWithFacebookReturnShape = [UseLoginState, () => void]
`.trim()
export default () => (
  <Section>
    <Text h1>
      React Thau: useLoginWithFacebook
    </Text>
    <Text p>
      <Code>useLoginWithFacebook</Code> hook allows you to make a user login using facebook.
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
    <Link block href="#react-thau-use-login-with-google">
      Next: useLoginWithGoogle()
    </Link>
  </Section>
)