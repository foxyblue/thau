import * as React from 'react'
import { Text, Code, Snippet, Spacer, Link, Note, Divider, Card, Dot } from '@zeit-ui/react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Section from '../Section'
import QueckStartReactExample, { source as REACT_CODE } from './examples/QuickStart'

const DOCKER_RUN_CODE = 'docker run -p 9000:9000 -e ENV=local -e DATA_BACKEND=sqlite -e ENABLED_STRATEGIES=password mgrin/thau:latest'

export default () => (
  <Section>
    <Text h1>
      Quick Start
    </Text>
    <Text p>
      <b>Thau</b> is a backend service that allows you to authenticate your users against multiple identity providers (such as Facebook or Google).
    </Text>
    <Text p>
      It's written in Typescript and can be started as a standalone <Code>Node.js</Code> service, but better to run it as a <Code>Docker</Code> image.
    </Text>
    <Text p>
      To start the <b>Thau</b> service you can just run the following:
    </Text>
    <Spacer />
    <Snippet
      style={{ overflowX: 'auto' }}
      copy="prevent"
      text={DOCKER_RUN_CODE}
    />
    <Text>
      The command above will start the <b>Thau</b> service on port <Code>9000</Code>.
    </Text>
    <Text>
      You can go to <Code><Link color href="http://localhost:9000/api-docs" target="_blank">http://localhost:9000/api-docs</Link></Code> to see the Swagger documentation.
    </Text>
    <Note>
      We pass some environment variables to <Code>docker run</Code> command.
      <b>Thau</b> is fully configurable through environment variables.
      You can find more in the <Link href="#backend-service" color>Backend service section</Link> of documentation.
    </Note>
    <Divider />
    <Text>
      You can use this API in your React application using <Code><Link color href="https://www.npmjs.com/package/react-thau" target="_blank">react-thau</Link></Code> npm package:
    </Text>
    <Card>
      <QueckStartReactExample />
      <Card.Footer>
        <SyntaxHighlighter language="tsx" style={githubGist} customStyle={{ maxHeight: 600 }}>
          {REACT_CODE}
        </SyntaxHighlighter>
      </Card.Footer>
    </Card>
    <Spacer />
    <Text p>
      In the example above some <Code>react-thau</Code> hooks are used, namely:
    </Text>
    <Text>
      <Dot style={{ marginRight: '6px' }} /> <Code>useCreateUserWithPassword</Code> <br />
      <Dot style={{ marginRight: '6px' }} /> <Code>useLoginWithPassword</Code> <br />
      <Dot style={{ marginRight: '6px' }} /> <Code>useUser</Code> <br />
      <Dot style={{ marginRight: '6px' }} /> <Code>useCurrentProvider</Code> <br />
      <Dot style={{ marginRight: '6px' }} /> <Code>useLogout</Code> <br />
    </Text>
    <Text p>
      You can find out the documentation for these hooks and for others (<Code>useLoginWithFacebook</Code> as an example) in the <Code><Link color href="#react-thau">react-thau</Link></Code> documentation.
    </Text>
  </Section>
)