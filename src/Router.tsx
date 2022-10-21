// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PAGES_CONFIG } from 'config/pages';
import { TitleDefault } from 'consts';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { AnimatePresence } from 'framer-motion';
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary';
import { Headers } from 'library/Headers';
import { Help } from 'library/Help';
import { Menu } from 'library/Menu';
import { NetworkBar } from 'library/NetworkBar';
import Notifications from 'library/Notifications';
import SideMenu from 'library/SideMenu';
import { Tooltip } from 'library/Tooltip';
import { Modal } from 'modals';
import { useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Helmet } from 'react-helmet';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import {
  BodyInterfaceWrapper,
  MainInterfaceWrapper,
  PageWrapper,
  SideInterfaceWrapper,
} from 'Wrappers';

export const RouterInner = () => {
  const { network } = useApi();
  const { pathname } = useLocation();
  const { sideMenuOpen, sideMenuMinimised, setContainerRefs } = useUi();

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
                            <title>{`${page.title} : ${TitleDefault}`}</title>
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
