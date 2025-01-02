// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PagesConfig } from 'config/pages'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useStaking } from 'contexts/Staking'
import { useUi } from 'contexts/UI'
import { useAccountFromUrl } from 'hooks/useAccountFromUrl'
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary'
import { Headers } from 'library/Headers'
import { Help } from 'library/Help'
import { Menu } from 'library/Menu'
import { NetworkBar } from 'library/NetworkBar'
import { NotificationPrompts } from 'library/NotificationPrompts'
import { Offline } from 'library/Offline'
import { PageWithTitle } from 'library/PageWithTitle'
import { Prompt } from 'library/Prompt'
import { SideMenu } from 'library/SideMenu'
import { Tooltip } from 'library/Tooltip'
import { Overlays } from 'overlay'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { StakingApi } from 'StakingApi'
import { Body, Main } from 'ui-structure'

const RouterInner = () => {
  const { network } = useNetwork()
  const { inSetup } = useStaking()
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
      {pluginEnabled('staking_api') && !inSetup() && activeAccount && (
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
        </Main>
      </Body>
      <NetworkBar />
      <Offline />
    </ErrorBoundary>
  )
}

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
)
