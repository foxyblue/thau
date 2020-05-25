import * as React from 'react'
import { Text, Code, Link, Spacer } from '@zeit-ui/react'
import Section from '../../Section'

export default () => (
  <Section>
    <Text h1>
      React Thau
    </Text>
    <Text p>
      After you successfully setup your <b>Thau</b> API, you can use it from any of your application. For this, you'll have to make a numbmer of calls to the API on your own. <br />
      If you have your application written in React or React Native, you an use use the <Code><Link color target="_blank" href="https://www.npmjs.com/package/react-thau">react-thau</Link></Code> npm package. <br />
      It exports a number of hooks that implements all the necessary calls to the API for you.
    </Text>
    <Spacer />
    <Link block href="#react-thau-install">
      Next: How to install and use react-thau
    </Link>
  </Section>
)