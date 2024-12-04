// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { extractUrlValue } from '@w3ux/utils'
import { PagesConfig } from 'config/pages'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts'
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts'
import { useNetwork } from 'contexts/Network'
import { usePrompt } from 'contexts/Prompt'
import { useUi } from 'contexts/UI'
import { Notifications } from 'controllers/Notifications'
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary'
import { Headers } from 'library/Headers'
import { Help } from 'library/Help'
import { Menu } from 'library/Menu'
import { NetworkBar } from 'library/NetworkBar'
import { Disclaimer } from 'library/NetworkBar/Disclaimer'
import { NotificationPrompts } from 'library/NotificationPrompts'
import { Offline } from 'library/Offline'
import { PageWithTitle } from 'library/PageWithTitle'
import { Prompt } from 'library/Prompt'
import { SideMenu } from 'library/SideMenu'
import { Tooltip } from 'library/Tooltip'
import { Overlays } from 'overlay'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { Body, Main } from 'ui-structure'
import { registerLastVisited, registerSaEvent } from 'utils'

const RouterInner = () => {
  const { t } = useTranslation()
  const { network } = useNetwork()
  const { pathname, search } = useLocation()
  const { accounts } = useImportedAccounts()
  const { accountsInitialised } = useOtherAccounts()
  const { activeAccount, setActiveAccount } = useActiveAccounts()
  const { openPromptWith } = usePrompt()
  const { setContainerRefs } = useUi()

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

  // References to outer container.
  const mainInterfaceRef = useRef<HTMLDivElement>(null)

  // Scroll to top of the window on every page change or network change.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, network])

  // Set container references to UI context and make available throughout app.
  useEffect(() => {
    setContainerRefs({
      mainInterface: mainInterfaceRef,
    })
  }, [])

  // Open default account modal if url var present and accounts initialised.
  useEffect(() => {
    if (accountsInitialised) {
      const aUrl = extractUrlValue('a')
      if (aUrl) {
        const account = accounts.find((a) => a.address === aUrl)
        if (account && aUrl !== activeAccount) {
          setActiveAccount(account.address || null)

          Notifications.emit({
            title: t('accountConnected', { ns: 'library' }),
            subtitle: `${t('connectedTo', { ns: 'library' })} ${
              account.name || aUrl
            }.`,
          })
        }
      }
    }
  }, [accountsInitialised])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackApp}>
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
