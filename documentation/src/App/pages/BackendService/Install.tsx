import * as React from 'react'
import { Text, Link, Spacer } from '@zeit-ui/react'
import Section from '../../Section'

export default () => (
  <Section>
    <Text h1>
      Backend Service - Install and Run
    </Text>
    
    <Spacer />
    <Link block href="#backend-service-install">
      Next: How to configure the service
    </Link>
  </Section>
)