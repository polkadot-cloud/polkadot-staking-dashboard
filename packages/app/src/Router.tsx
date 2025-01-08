// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PagesConfig } from 'config/pages'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useUi } from 'contexts/UI'
import { useAccountFromUrl } from 'hooks/useAccountFromUrl'
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary'
import { Headers } from 'library/Headers'
import { Help } from 'library/Help'
import { MainFooter } from 'library/MainFooter'
import { Menu } from 'library/Menu'
import { NotificationPrompts } from 'library/NotificationPrompts'
import { PageWithTitle } from 'library/PageWithTitle'
import { Prompt } from 'library/Prompt'
import { SideMenu } from 'library/SideMenu'
import { Tooltip } from 'library/Tooltip'
import { Offline } from 'Offline'
import { Overlays } from 'overlay'
import { ApolloProvider, client } from 'plugin-staking-api'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { StakingApi } from 'StakingApi'
import { Body, Main } from 'ui-core/base'

const RouterInner = () => {
  const { network } = useNetwork()
  const { pathname } = useLocation()
  const { setContainerRefs } = useUi()
  const { pluginEnabled } = usePlugins()
  const { activeAccount } = useActiveAccounts()

  // References to outer container
  const mainInterfaceRef = useRef<HTMLDivElement>(null)

  // Scroll to top of the window on every page change or network change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, network])

  // Set container references to UI context and make available throughout app
  useEffect(() => {
    setContainerRefs({
      mainInterface: mainInterfaceRef,
    })
  }, [])

  // Support active account from url
  useAccountFromUrl()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackApp}>
      <ApolloProvider client={client}>
        {pluginEnabled('staking_api') && activeAccount && (
          <StakingApi activeAccount={activeAccount} network={network} />
        )}
        <NotificationPrompts />
        <Body>
          <Help />
          <Overlays />
          <Menu />
          <Tooltip />
          <Prompt />
          <SideMenu />
          <Main ref={mainInterfaceRef}>
            <HelmetProvider>
              <Headers />
              <ErrorBoundary FallbackComponent={ErrorFallbackRoutes}>
                <Routes>
                  {PagesConfig.map((page, i) => (
                    <Route
                      key={`main_interface_page_${i}`}
                      path={page.hash}
                      element={<PageWithTitle page={page} />}
                    />
                  ))}
                  <Route
                    key="main_interface_navigate"
                    path="*"
                    element={<Navigate to="/overview" />}
                  />
                </Routes>
              </ErrorBoundary>
              <MainFooter />
            </HelmetProvider>
          </Main>
        </Body>
        <Offline />
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
)
