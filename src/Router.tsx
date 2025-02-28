// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { registerLastVisited, registerSaEvent } from 'Utils';
import { usePrompt } from 'contexts/Prompt';
import { Disclaimer } from 'library/NetworkBar/Disclaimer';
import { Body, Main, Page, Side } from '@polkadot-cloud/react';
import { extractUrlValue } from '@polkadot-cloud/utils';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Prompt } from 'library/Prompt';
import { PagesConfig } from 'config/pages';
import { useUi } from 'contexts/UI';
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary';
import { Headers } from 'library/Headers';
import { Help } from 'library/Help';
import { Menu } from 'library/Menu';
import { NetworkBar } from 'library/NetworkBar';
import { SideMenu } from 'library/SideMenu';
import { Tooltip } from 'library/Tooltip';
import { Overlays } from 'overlay';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { SideMenuMaximisedWidth } from 'consts';
import { useTheme } from 'styled-components';
import { Notifications } from 'library/Notifications';
import { NotificationsController } from 'static/NotificationsController';

export const RouterInner = () => {
  const { t } = useTranslation();
  const mode = useTheme();
  const { network } = useNetwork();
  const { pathname, search } = useLocation();
  const { accounts } = useImportedAccounts();
  const { accountsInitialised } = useOtherAccounts();
  const { activeAccount, setActiveAccount } = useActiveAccounts();
  const { sideMenuOpen, sideMenuMinimised, setContainerRefs } = useUi();
  const { openPromptWith } = usePrompt();

  // register landing source from URL
  useEffect(() => {
    const utmSource = extractUrlValue('utm_source', search);
    if (utmSource) {
      registerSaEvent(`conversion_${utmSource}`);
    }

    if (!localStorage.getItem('last_visited')) {
      setTimeout(() => {
        openPromptWith(<Disclaimer />);
      }, 5000);
    }
    registerLastVisited(utmSource);
  }, []);

  // Scroll to top of the window on every page change or network change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, network]);

  // Set references to UI context and make available throughout app.
  useEffect(() => {
    setContainerRefs({
      mainInterface: mainInterfaceRef,
    });
  }, []);

  // Update body background to `--background-default` upon theme change.
  useEffect(() => {
    const elem = document.querySelector('.core-entry');
    if (elem) {
      document.getElementsByTagName('body')[0].style.backgroundColor =
        getComputedStyle(elem).getPropertyValue('--background-default');
    }
  }, [mode]);

  // Open default account modal if url var present and accounts initialised.
  useEffect(() => {
    if (accountsInitialised) {
      const aUrl = extractUrlValue('a');
      if (aUrl) {
        const account = accounts.find((a) => a.address === aUrl);
        if (account && aUrl !== activeAccount) {
          setActiveAccount(account.address || null);

          NotificationsController.emit({
            title: t('accountConnected', { ns: 'library' }),
            subtitle: `${t('connectedTo', { ns: 'library' })} ${
              account.name || aUrl
            }.`,
          });
        }
      }
    }
  }, [accountsInitialised]);

  // References to outer containers
  const mainInterfaceRef = useRef<HTMLDivElement>(null);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackApp}>
      {/* Notification popups */}
      <Notifications />

      <Body>
        {/* Help: closed by default */}
        <Help />

        {/* Overlays: modal and canvas. Closed by default */}
        <Overlays />

        {/* Menu: closed by default */}
        <Menu />

        {/* Tooltip: invisible by default */}
        <Tooltip />

        {/* Prompt: closed by default */}
        <Prompt />

        {/* Left side menu */}
        <Side
          open={sideMenuOpen}
          minimised={sideMenuMinimised}
          width={`${SideMenuMaximisedWidth}px`}
        >
          <SideMenu />
        </Side>

        {/* Main content window */}
        <Main ref={mainInterfaceRef}>
          {/* Fixed headers */}
          <Headers />

          <ErrorBoundary FallbackComponent={ErrorFallbackRoutes}>
            <AnimatePresence>
              <Routes>
                {PagesConfig.map((page, i) => {
                  const { Entry, hash, key } = page;

                  return (
                    <Route
                      key={`main_interface_page_${i}`}
                      path={hash}
                      element={
                        <Page>
                          <Helmet>
                            <title>{`${t(key, { ns: 'base' })} : ${t('title', {
                              context: `${network}`,
                              ns: 'base',
                            })}`}</title>
                          </Helmet>
                          <Entry page={page} />
                        </Page>
                      }
                    />
                  );
                })}
                <Route
                  key="main_interface_navigate"
                  path="*"
                  element={<Navigate to="/overview" />}
                />
              </Routes>
            </AnimatePresence>
          </ErrorBoundary>
        </Main>
      </Body>

      {/* Network status and network details */}
      <NetworkBar />
    </ErrorBoundary>
  );
};

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
);
