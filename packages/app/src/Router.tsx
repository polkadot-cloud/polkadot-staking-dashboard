// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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
  useNavigate,
  useParams,
} from 'react-router-dom'
import { StakingApi } from 'StakingApi'
import { Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

// Enhanced Pool Invite Handler
const PoolInviteRedirect = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openCanvas } = useOverlay().canvas

  useEffect(() => {
    if (id) {
      console.log('Processing pool invite with id:', id)

      // Open the Pool canvas with the provided ID
      openCanvas({
        key: 'Pool',
        options: {
          id: Number(id),
          fromInvite: true,
        },
      })

      // Navigate to pools page
      navigate('/pools', { replace: true })
    } else {
      // If no ID provided, just go to pools page
      navigate('/pools', { replace: true })
    }
  }, [id, navigate, openCanvas])

  // Show a temporary return while the navigation happens
  return null
}

// Enhanced Validator Invite Handler
const ValidatorInviteRedirect = () => {
  const { address } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (address) {
      console.log('Processing validator invite with address:', address)

      // Navigate to nominate page with the validator address in state
      navigate('/nominate', {
        state: { inviteValidatorAddress: address },
        replace: true,
      })
    } else {
      // If no address provided, just go to validators page
      navigate('/validators', { replace: true })
    }
  }, [address, navigate])

  // Show a temporary return while the navigation happens
  return null
}

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
        <Page.Body>
          <Help />
          <Overlays />
          <Menu />
          <Tooltip />
          <Prompt />
          <SideMenu />
          <Page.Main ref={mainInterfaceRef}>
            <HelmetProvider>
              <Headers />
              <ErrorBoundary FallbackComponent={ErrorFallbackRoutes}>
                <Routes>
                  <Route
                    path="/invite/pool/:id"
                    element={<PoolInviteRedirect />}
                  />
                  <Route
                    path="/invite/validator/:address"
                    element={<ValidatorInviteRedirect />}
                  />
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
          </Page.Main>
        </Page.Body>
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
