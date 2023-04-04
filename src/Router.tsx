// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Body, Main } from '@polkadotcloud/core-ui';
import { extractUrlValue } from '@polkadotcloud/utils';
import { registerLastVisited, registerSaEvent } from 'Utils';
import { PageWrapper, SideInterfaceWrapper } from 'Wrappers';
import { PagesConfig } from 'config/pages';
import { useApi } from 'contexts/Api';
import { useOverlay } from 'contexts/Overlay';
import { useUi } from 'contexts/UI';
import { AnimatePresence } from 'framer-motion';
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary';
import { Headers } from 'library/Headers';
import { Help } from 'library/Help';
import { Menu } from 'library/Menu';
import { NetworkBar } from 'library/NetworkBar';
import { Disclaimer } from 'library/NetworkBar/Disclaimer';
import { Notifications } from 'library/Notifications';
import { Overlay } from 'library/Overlay';
import { SideMenu } from 'library/SideMenu';
import { Tooltip } from 'library/Tooltip';
import { Modal } from 'modals';
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

export const RouterInner = () => {
  const { t } = useTranslation('base');
  const { pathname, search } = useLocation();
  const { network } = useApi();
  const { sideMenuOpen, sideMenuMinimised, setContainerRefs } = useUi();
  const { openOverlayWith } = useOverlay();

  // register landing source from URL
  useEffect(() => {
    const utmSource = extractUrlValue('utm_source', search);
    if (utmSource) {
      registerSaEvent(`conversion_${utmSource}`);
    }

    if (!localStorage.getItem('last_visited')) {
      setTimeout(() => {
        openOverlayWith(<Disclaimer />);
      }, 5000);
    }
    registerLastVisited(utmSource);
  }, []);

  // scroll to top of the window on every page change or network change
  // scroll to top of the window on every page change or network change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, network]);

  // set references to UI context and make available throughout app.
  useEffect(() => {
    setContainerRefs({
      mainInterface: mainInterfaceRef,
    });
  }, []);

  // references to outer containers
  const mainInterfaceRef = useRef<HTMLDivElement>(null);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackApp}>
      <Body>
        {/* Modal: closed by default */}
        <Modal />
        {/* Help: closed by default */}
        <Help />

        {/* Menu: closed by default */}
        <Menu />

        {/* Tooltip: invisible by default */}
        <Tooltip />

        {/* Overlay: closed by default */}
        <Overlay />

        {/* Left side menu */}
        <SideInterfaceWrapper open={sideMenuOpen} minimised={sideMenuMinimised}>
          <SideMenu />
        </SideInterfaceWrapper>

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
                        <PageWrapper
                          key={`main_interface_key__${i}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Helmet>
                            <title>{`${t(key)} : ${t('title', {
                              context: `${network.name}`,
                            })}`}</title>
                          </Helmet>
                          <Entry page={page} />
                        </PageWrapper>
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

      {/* Notification popups */}
      <Notifications />
    </ErrorBoundary>
  );
};

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
);
