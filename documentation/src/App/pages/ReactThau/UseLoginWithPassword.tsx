import * as React from 'react'
import { Text, Code, Link, Spacer } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
// Here the @zeit-ui is used for simplicity of UI building
import { Input, Row, Spacer, Button, Text } from '@zeit-ui/react'
import { useLoginWithPassword } from 'react-thau'

export default () => (
  const [{ loading, error }, login] = useLoginWithPassword()
  const [loginState, setLoginState] = React.useState<any>({})
  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginState({
      ...loginState,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Row>
        <Input
          placeholder="Email (required))"
          type="email"
          name="email"
          onChange={onFormChange}
        />
      </Row>
      <Spacer />
      <Row>
        <Input
          placeholder="Password (required))"
          type="password"
          name="password"
          onChange={onFormChange}
        />
      </Row>
      <Spacer />
      {error && (
        <Text type="error">{error.message}</Text>
      )}
      <Spacer />
      <Button
        loading={loading}
        disabled={!loginState.email || !loginState.password}
        type="success"
        ghost
        onClick={() => login(loginState)}
      >
        Sing In
      </Button>
    </>
  )
)
`.trim()

const ARGUMENTS = `
type UseLoginWithPasswordArgs = {
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

type LoginWithPasswordCredentials = {
  email: string
  password: string
}

type UseLoginWithPasswordReturnShape = [UseLoginState, (credentials: LoginWithPasswordCredentials) => void]
`.trim()
export default () => (
  <Section>
    <Text h1>
      React Thau: useLoginWithPassword
    </Text>
    <Text p>
      <Code>useLoginWithPassword</Code> hook allows you to make a user login using password.
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
    <Link block href="#react-thau-use-login-with-facebook">
      Next: useLoginWithFacebook()
    </Link>
  </Section>
)