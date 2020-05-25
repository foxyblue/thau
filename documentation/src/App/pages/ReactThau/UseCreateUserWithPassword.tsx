import * as React from 'react'
import { Text, Code, Link, Spacer } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../../Section'

const EXAMPLE = `
import * as React from 'react'
// Here the @zeit-ui is used for simplicity of UI building
import { Input, Row, Spacer, Button, Text } from '@zeit-ui/react'
import { useCreateUserWithPassword } from 'react-thau'

export default () => (
  const [{ loading, error, token, user }, createUser] = useCreateUserWithPassword()

  const [newUserState, setNewUserState] = React.useState<any>({})
  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserState({
      ...newUserState,
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
      <Row>
        <Input
          placeholder="Username (required)"
          name="username"
          onChange={onFormChange}
        />
      </Row>
      <Spacer />
      <Row>
        <Input
          placeholder="First name"
          name="first_name"
          onChange={onFormChange}
        />
      </Row>
      <Spacer />
      <Row>
        <Input
          placeholder="Last name"
          name="last_name"
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
        disabled={!newUserState.email || !newUserState.password}
        type="success"
        ghost
        onClick={() => createUser(newUserState)}
      >
        Sing Up
      </Button>
    </>
  )
)
`.trim()

const ARGUMENTS = `
type UseCreateUserWithPasswordArgs = {
  fetchOptions?: FetchOptions
}
`.trim()

const RETURN_SHAPE = `
type CreateUserWithPasswordState = {
  loading: boolean
  error: APIError | null
  token: string | null
  user: User | null
}

type UseCreateUserWithPasswordReturnShape = [CreateUserWithPasswordState, (userInfo: User) => void]
`.trim()
export default () => (
  <Section>
    <Text h1>
      React Thau: useCreateUserWithPassword
    </Text>
    <Text p>
      <Code>useCreateUserWithPassword</Code> hook allows you to create a user from inside your service that will be able to login using password.
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
    <Link block href="#react-thau-use-login-with-password">
      Next: useLoginWithPassword()
    </Link>
  </Section>
)