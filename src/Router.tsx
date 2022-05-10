// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { PageWrapper } from './Wrappers';
import { Routes, Route, HashRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion"
import { PAGES_CONFIG } from './pages';
import { NetworkBar } from './library/NetworkBar';
import { Modal } from './modals';
import { Headers } from './library/Headers';
import SideMenu from './library/SideMenu';
import Assistant from './library/Assistant';
import Notifications from './library/Notifications';
import { useLocation, Navigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { TITLE_DEFAULT } from './constants';
import { useUi } from './contexts/UI';
import {
  SideInterfaceWrapper,
  MainInterfaceWrapper,
  BodyInterfaceWrapper,
} from './Wrappers';

export const RouterInner = () => {

  const { pathname } = useLocation();
  const { sideMenuOpen, sideMenuMinimised } = useUi();

  // scroll to top of the window on every page change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {/* Modal: closed by default */}
      <Modal />
      <BodyInterfaceWrapper>

        {/* Assistant: closed by default */}
        <Assistant />

        {/* Left side menu */}
        <SideInterfaceWrapper open={sideMenuOpen} minimised={sideMenuMinimised}>
          <SideMenu />
        </SideInterfaceWrapper>

        {/* Main content window */}
        <MainInterfaceWrapper>

          {/* Fixed headers */}
          <Headers />

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
                          <title>{`${page.title} :: ${TITLE_DEFAULT}`}</title>
                        </Helmet>
                        <Entry page={page} />
                      </PageWrapper>
                    }
                  />
                )
              })}
              <Route
                key={`main_interface_navigate`}
                path="*"
                element={<Navigate to='/overview' />}
              />
            </Routes>
          </AnimatePresence>
        </MainInterfaceWrapper>
      </BodyInterfaceWrapper>

      {/* Network status and network details */}
      <NetworkBar />

      {/* Notification popups */}
      <Notifications />
    </>
  );
}

export const Router = () => {
  return (
    <HashRouter basename="/">
      <RouterInner />
    </HashRouter>
  )
}
export default Router;