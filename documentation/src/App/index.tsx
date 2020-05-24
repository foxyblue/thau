import React from 'react'
import { Page, Grid, Divider } from '@zeit-ui/react'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import Introduction from './pages/Introduction'
import QuickStart from './pages/QuickStart'
import BackendService from './pages/BackendService'
import BackendServiceInstall from './pages/BackendService/Install'

const ScrollableGrid = styled(Grid)`
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 118px);
`

const pages = [{
  name: 'Introduction',
  component: Introduction,
  id: 'introduction'
}, {
  name: 'Quick start',
  component: QuickStart,
  id: 'quick-start',
}, 'DIVIDER', {
  name: 'Backend service',
  h5: true,
  component: BackendService,
  id: 'backend-service',
}, {
  name: 'Install',
  component: BackendServiceInstall,
  id: 'backend-service-install'
}, {
  name: 'Service',
  component: Introduction,
  id: 'backend-service-service'
}, {
  name: 'Data backend',
  component: Introduction,
  id: 'backend-service-data'
}, {
  name: 'Login strategy',
  component: Introduction,
  id: 'backend-service-login'
}, {
  name: 'Broadcast channel',
  component: Introduction,
  id: 'backend-service-broadcast'
}, 'DIVIDER', {
  name: 'react-thau',
  component: Introduction,
  h5: true,
  id: 'react-thau'
}]

export default () => {
  return (
    <Page>
      <Page.Header>
        <h1>Thau</h1>
        <p>Ready-to-use authentication service for your application</p>
      </Page.Header>
      <Divider />
      <Page.Content style={{ padding: 0 }}>
        <Grid.Container gap={2} justify="center">
          <Grid xs={6}>
            <Sidebar pages={pages} />
          </Grid>
          <ScrollableGrid xs={24} md={18}>
            {pages.filter((p: any) => p !== 'DIVIDER').map((page: any) => (
              <div id={page.id} key={page.name}>
                <page.component />
                <Divider />
              </div>
            ))}
          </ScrollableGrid>
        </Grid.Container>
      </Page.Content>
    </Page>
  )
}
