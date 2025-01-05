// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { PagesConfig } from 'config/pages'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { usePrompt } from 'contexts/Prompt'
import { useUi } from 'contexts/UI'
import { useAccountFromUrl } from 'hooks/useAccountFromUrl'
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary'
import { Headers } from 'library/Headers'
import { Help } from 'library/Help'
import { MainFooter } from 'library/MainFooter'
import { Disclaimer } from 'library/MainFooter/Disclaimer'
import { Menu } from 'library/Menu'
import { NotificationPrompts } from 'library/NotificationPrompts'
import { PageWithTitle } from 'library/PageWithTitle'
import { Prompt } from 'library/Prompt'
import { SideMenu } from 'library/SideMenu'
import { Tooltip } from 'library/Tooltip'
import { Offline } from 'Offline'
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
import { Body, Main } from 'ui-core/base'
import { registerLastVisited, registerSaEvent } from 'utils'

const RouterInner = () => {
  const { network } = useNetwork()
  const { setContainerRefs } = useUi()
  const { openPromptWith } = usePrompt()
  const { pluginEnabled } = usePlugins()
  const { pathname, search } = useLocation()
  const { activeAccount } = useActiveAccounts()

  // register landing source from URL
  useEffect(() => {
    const utmSource = extractUrlValue('utm_source', search)
    if (utmSource) {
      registerSaEvent(`conversion_${utmSource}`)
    }

    if (!localStorage.getItem('last_visited')) {
      setTimeout(() => {
        openPromptWith(<Disclaimer />)
      }, 5000)
    }
    registerLastVisited(utmSource)
  }, [])

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
        </Main>
      </Body>
      <Offline />
    </ErrorBoundary>
  )
}

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
)
