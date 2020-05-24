import * as React from 'react'
import { User, Tabs, Input, Row, Spacer, Button, Text } from '@zeit-ui/react'
import {
  AuthProvider,
  useCreateUserWithPassword,
  useLoginWithPassword,
  useUser,
  useCurrentProvider,
  useLogout,
} from '../../../react-thau'

const NewUserForm = () => {
  const [{ loading, error }, createNewUser] = useCreateUserWithPassword()

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
        onClick={() => createNewUser(newUserState)}
      >
        Sing Up
      </Button>
    </>
  )
}

const LoginForm = () => {
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
}

const App = () => {
  const user = useUser()
  const provider = useCurrentProvider()
  const [{ loading: loadingLogout, error: errorLogout }, logout] = useLogout()

  return (
    <>
      {user && (
        <>
          <User src={user.picture || 'https://storage.googleapis.com/thau/logo/logo-image.png'} name={`${user.username}`}>
            {user.first_name} {user.last_name} ({user.email})<br />
            Logged in using {provider}
          </User>
          <Spacer />
          <Button
            type="success"
            loading={loadingLogout}
            ghost
            onClick={logout}
          >
            Logout
          </Button>
          {errorLogout && (
            <Text type="error">{errorLogout.message}</Text>
          )}
        </>
      )}
      {!user && (
        <Tabs initialValue="1">
          <Tabs.Item label="Sign Up" value="1">
            <NewUserForm />
          </Tabs.Item>
          <Tabs.Item label="Sign In" value="2">
            <LoginForm />
          </Tabs.Item>
        </Tabs>
      )}
    </>
  )
}

export default () => (
  <AuthProvider authUrl="https://thau.quester-app.dev">
    <App />
  </AuthProvider>
)

export const source = `
import * as React from 'react'

// Here the @zeit-ui is used for simplicity of UI building
import { User, Tabs, Input, Row, Spacer, Button, Text } from '@zeit-ui/react'
import {
  AuthProvider,
  useCreateUserWithPassword,
  useLoginWithPassword,
  useUser,
  useCurrentProvider,
  useLogout,
} from 'react-thau'

export default () => (
  <AuthProvider authUrl="https://thau.quester-app.dev">
    <App />
  </AuthProvider>
)

const App = () => {
  const user = useUser()
  const provider = useCurrentProvider()
  const [{ loading: loadingLogout, error: errorLogout }, logout] = useLogout()

  return (
    <>
      {user && (
        <>
          <Row>
            <User src={user.picture || 'https://storage.googleapis.com/thau/logo/logo-image.png'} name={\`\${user.username}\`}>
              {user.first_name} {user.last_name} ({user.email})<br />
              Logged in using {provider}
            </User>
          </Row>
          <Spacer />
          <Row>
            <Button
              type="success"
              loading={loadingLogout}
              ghost
              onClick={logout}
            >
              Logout
            </Button>
            {errorLogout && (
              <Text type="error">{errorLogout.message}</Text>
            )}
          </Row>
          
        </>
      )}
      {!user && (
        <Tabs initialValue="1">
          <Tabs.Item label="Sign Up" value="1">
            <NewUserForm />
          </Tabs.Item>
          <Tabs.Item label="Sign In" value="2">
            <LoginForm />
          </Tabs.Item>
        </Tabs>
      )}
    </>
  )
}

const NewUserForm = () => {
  const [{ loading, error }, createNewUser] = useCreateUserWithPassword()

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
        onClick={() => createNewUser(newUserState)}
      >
        Sing Up
      </Button>
    </>
  )
}

const LoginForm = () => {
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
}
`.trim()