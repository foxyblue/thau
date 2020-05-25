import React from 'react'
import { Page, Grid, Divider, useMediaQuery, Card } from '@zeit-ui/react'
import { Menu as MenuIcon } from '@zeit-ui/react-icons'
import styled from 'styled-components'
import { slide as Menu } from 'react-burger-menu'
import Sidebar from './Sidebar'
import Introduction from './pages/Introduction'
import QuickStart from './pages/QuickStart'
import BackendService from './pages/BackendService'
import BackendServiceInstall from './pages/BackendService/Install'
import BackendServiceGeneralConfigurations from './pages/BackendService/GeneralConfigurations'
import BackendServiceDataBackendConfigurations from './pages/BackendService/DataBackends'
import BackendServiceLoginStrategiesConfigurations from './pages/BackendService/LoginStrategy'
import BackendServiceBroadcastConfigurations from './pages/BackendService/BroadcastConfiguration'
import ReactThau from './pages/ReactThau'
import ReactThauInstall from './pages/ReactThau/Install'
import ReactThauProvider from './pages/ReactThau/Provider'
import ReactThauUseAuth from './pages/ReactThau/UseAuth'
import ReactThauUseUser from './pages/ReactThau/UseUser'
import ReactThauUseCurrentProvider from './pages/ReactThau/UseCurrentProvider'
import ReactThauUseCreateUserWithPassword from './pages/ReactThau/UseCreateUserWithPassword'
import ReactThauUseLoginWithPassword from './pages/ReactThau/UseLoginWithPassword'
import ReactThauUseLoginWithFacebook from './pages/ReactThau/UseLoginWithFacebook'
import ReactThauUseLoginWithGoogle from './pages/ReactThau/UseLoginWithGoogle'
import ReactThauUseLogout from './pages/ReactThau/UseLogout'
import useOnScreen from '../useOnScreen'

const ScrollableGrid = styled(Grid)<{ fullHeight?: boolean }>`
  overflow-y: auto;
  overflow-x: hidden;
  height: ${({ fullHeight }) => fullHeight ? '100vh' : 'calc(100vh - 118px)'};
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
  name: 'Install and Run',
  component: BackendServiceInstall,
  id: 'backend-service-install'
}, {
  name: 'General configuration',
  component: BackendServiceGeneralConfigurations,
  id: 'backend-service-general-configurations'
}, {
  name: 'Data backend configuration',
  component: BackendServiceDataBackendConfigurations,
  id: 'backend-service-data'
}, {
  name: 'Login strategy configuration',
  component: BackendServiceLoginStrategiesConfigurations,
  id: 'backend-service-login'
}, {
  name: 'Broadcast channel configuration',
  component: BackendServiceBroadcastConfigurations,
  id: 'backend-service-broadcast'
}, 'DIVIDER', {
  name: 'react-thau',
  component: ReactThau,
  h5: true,
  id: 'react-thau'
}, {
  name: 'Install',
  component: ReactThauInstall,
  id: 'react-thau-install'
}, {
  name: 'Auth Provider',
  component: ReactThauProvider,
  id: 'react-thau-provider'
}, {
  name: 'useAuth',
  component: ReactThauUseAuth,
  id: 'react-thau-use-auth'
}, {
  name: 'useUser',
  component: ReactThauUseUser,
  id: 'react-thau-use-user'
}, {
  name: 'useCurrentProvider',
  component: ReactThauUseCurrentProvider,
  id: 'react-thau-use-provider'
}, {
  name: 'useCreateUserWithPassword',
  component: ReactThauUseCreateUserWithPassword,
  id: 'react-thau-use-create-user'
}, {
  name: 'useLoginWithPassword',
  component: ReactThauUseLoginWithPassword,
  id: 'react-thau-use-login-with-password'
}, {
  name: 'useLoginWithFacebook',
  component: ReactThauUseLoginWithFacebook,
  id: 'react-thau-use-login-with-facebook'
}, {
  name: 'useLoginWithGoogle',
  component: ReactThauUseLoginWithGoogle,
  id: 'react-thau-use-login-with-google'
}, {
  name: 'useLogout',
  component: ReactThauUseLogout,
  id: 'react-thau-use-logout'
}]

export default () => {
  const referencees = pages.filter((p: any) => p !== 'DIVIDER').reduce((acc, page: any) => ({
    ...acc,
    [page.name]: React.useRef<any>()
  }), {}) as any
  const onScreens = pages.filter((p: any) => p !== 'DIVIDER').reduce((acc, page: any) => ({
    ...acc,
    [page.name]: useOnScreen(referencees[page.name], '-200px')
  }), {}) as any
  const visiblePage = Object.keys(onScreens).filter((pageName: string) => onScreens[pageName])[0]

  const isXS = useMediaQuery('xs')
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <>
      {isXS && (
        <Menu
          // @ts-ignore
          isOpen={isMenuOpen}
          onStateChange={(state) => {
            if (!state.isOpen) {
              setIsMenuOpen(false)
            }
          }}
        >
          <ScrollableGrid xs={false} sm={6} fullHeight>
            <Card>
              <Sidebar pages={pages} visiblePage={visiblePage} />
            </Card>
          </ScrollableGrid>
        </Menu>
      )}
      <Page>
        <Page.Header>
          <h1 onClick={() => isXS ? setIsMenuOpen(true) : null} >
            {isXS && (
              <div style={{ display: 'inline' }}>
                <MenuIcon color="dark" />
              </div>
            )}
            Thau
          </h1>
          <p>Ready-to-use authentication service for your application</p>          
        </Page.Header>
        <Divider />
        <Page.Content style={{ padding: 0 }}>
          <Grid.Container gap={2} justify="center">
            {!isXS && (
              <ScrollableGrid xs={false} sm={6}>
                <Sidebar pages={pages} visiblePage={visiblePage} />
              </ScrollableGrid>
            )}
            <ScrollableGrid xs={24} sm={18}>
              {pages.filter((p: any) => p !== 'DIVIDER').map((page: any) => (
                <div id={page.id} key={page.name} ref={referencees[page.name]}>
                  <page.component />
                  <Divider />
                </div>
              ))}
            </ScrollableGrid>
          </Grid.Container>
        </Page.Content>
      </Page>
    </>
  )
}
