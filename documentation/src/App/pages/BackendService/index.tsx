import * as React from 'react'
import { Text, Code, Link, Spacer, Image } from '@zeit-ui/react'
import Section from '../../Section'
export default () => (
  <Section>
    <Text h1>
      Backend service
    </Text>
    <Text p>
      <b>Thau</b> is a backend service that allows you to authenticate your users against multiple identity providers (such as Facebook or Google).
    </Text>
    <Text p>
      It's written in Typescript and can be started as a standalone <Code>Node.js</Code> service, but better to run it as a <Code>Docker</Code> image.
    </Text>
    <Text p>
      You can find the <Code>mgrin/thau</Code> docker image <Link color href="https://hub.docker.com/repository/docker/mgrin/thau">here</Link>.
    </Text>
    <Text p>
      <b>Thau</b> API requires you to pass a number of configurations to it on order to work properly. You can configure it using environmeents variables or a configuration file. The configuration file can be in <Code>yaml</Code> or <Code>json</Code> formats.
    </Text>
    <Image src="https://raw.githubusercontent.com/MGrin/thau/master/Schema.png" style={{ maxHeight: '50vh' }}/>
    <Spacer />
    <Link block href="#backend-service-install">
      Next: How to install and run Thau API
    </Link>
  </Section>
)