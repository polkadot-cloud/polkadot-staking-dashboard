// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useRef } from 'react';
import {
  Routes,
  Route,
  HashRouter,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Menu } from 'library/Menu';
import {
  PageWrapper,
  SideInterfaceWrapper,
  MainInterfaceWrapper,
  BodyInterfaceWrapper,
} from 'Wrappers';
import { PAGES_CONFIG } from 'config/pages';
import { NetworkBar } from 'library/NetworkBar';
import { Modal } from 'modals';
import { Headers } from 'library/Headers';
import SideMenu from 'library/SideMenu';
import { Help } from 'library/Help';
import Notifications from 'library/Notifications';
import { TITLE_DEFAULT } from 'consts';
import { useUi } from 'contexts/UI';
import { useApi } from 'contexts/Api';
import { Tooltip } from 'library/Tooltip';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackRoutes, ErrorFallbackApp } from 'library/ErrorBoundary';
import { useTranslation } from 'react-i18next';

export const RouterInner = () => {
  const { network } = useApi();
  const { pathname } = useLocation();
  const { sideMenuOpen, sideMenuMinimised, setContainerRefs } = useUi();
  const { t } = useTranslation('pages');

  // scroll to top of the window on every page change or network change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, network]);

  // set references to UI context and make available throughout app
  useEffect(() => {
    setContainerRefs({
      mainInterface: mainInterfaceRef,
    });
  }, []);

  // references to outer containers
  const mainInterfaceRef = useRef<HTMLDivElement>(null);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallbackApp}>
      {/* Modal: closed by default */}
      <Modal />
      <BodyInterfaceWrapper>
        {/* Help: closed by default */}
        <Help />

        {/* Tooltip: invisible by default */}
        <Tooltip />

        {/* Menu: closed by default */}
        <Menu />

        {/* Left side menu */}
        <SideInterfaceWrapper open={sideMenuOpen} minimised={sideMenuMinimised}>
          <SideMenu />
        </SideInterfaceWrapper>

        {/* Main content window */}
        <MainInterfaceWrapper ref={mainInterfaceRef}>
          {/* Fixed headers */}
          <Headers />

          <ErrorBoundary FallbackComponent={ErrorFallbackRoutes}>
            <AnimatePresence>
              <Routes>
                {PAGES_CONFIG.map((page, pageIndex) => {
                  const { Entry } = page;

                  return (
                    <Route
                      key={`main_interface_page_${pageIndex}`}
                      path={page.hash}
                      element={
                        <PageWrapper
                          key={`main_interface_key__${pageIndex}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Helmet>
                            <title>{`${t(page.key)} : ${TITLE_DEFAULT}`}</title>
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
        </MainInterfaceWrapper>
      </BodyInterfaceWrapper>

      {/* Network status and network details */}
      <NetworkBar />

      {/* Notification popups */}
      <Notifications />
    </ErrorBoundary>
  );
};

export const Router = () => {
  return (
    <HashRouter basename="/">
      <RouterInner />
    </HashRouter>
  );
};
export default Router;
