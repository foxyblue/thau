import * as React from 'react'
import { Image, ButtonGroup, Button, Grid, Spacer, Link, Text, Display } from '@zeit-ui/react'
import { Codesandbox, Github, Grid as GridIcon, Package } from '@zeit-ui/react-icons'
import Section from '../Section'

export default () => (
  <Section>
    <Image src="https://storage.googleapis.com/thau/logo/facebook_cover_photo_2.png" />
    <Display>
      <ButtonGroup>
        <Button icon={<Codesandbox />} auto>
          <Link href="https://thau.quester-app.dev/api/v1/docs" target="_blank">
            Swagger
          </Link>
        </Button>
        <Button icon={<Github />} auto>
          <Link href="https://github.com/MGrin/thau" target="_blank">
            GitHub
          </Link>
        </Button>
        <Button icon={<GridIcon />} auto>
          <Link href="https://hub.docker.com/repository/docker/mgrin/thau" target="_blank">
            Docker
          </Link>
        </Button>
        <Button icon={<Package />} auto>
          <Link href="https://www.npmjs.com/package/react-thau" target="_blank">
            NPM
          </Link>
        </Button>
      </ButtonGroup>
    </Display>
    <Text>
      Authentication is always a nightmare.
    </Text>
    <Text p>
      Every time you start a new project, you reimplement the wheel solving a "how to make user login" problem.
    </Text>
    <Text p>
      <b>Thau</b> is here for you!
    </Text>
    <Spacer y={2}/>
    <Grid.Container gap={2} justify="center">
      <Grid>
        <Link href="#quick-start" block>
          Quick start
        </Link>
      </Grid>
      <Grid>
        <Link href="#backend-service" block>
          Backend
        </Link>
      </Grid>
      <Grid>
        <Link href="#react-thau" block>
          Frontend
        </Link>
      </Grid>
    </Grid.Container>
  </Section>
)