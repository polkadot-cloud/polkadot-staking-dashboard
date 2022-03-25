// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { PageWrapper } from './Wrappers';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion"
import { PAGES_CONFIG } from './pages';
import { StakingMetricsContextWrapper } from './contexts/Staking';
import { MessagesContextWrapper } from './contexts/Messages';
import { NetworkBar } from './library/NetworkBar';
import { Modal } from './library/Modal';
import { Headers } from './library/Headers';
import SideMenu from './library/SideMenu';
import Assistant from './library/Assistant';
import { BrowserRouter } from "react-router-dom";
import {
  SideInterfaceWrapper,
  MainInterfaceWrapper,
  BodyInterfaceWrapper,
} from './Wrappers';
import Notifications from './library/Notifications';
import { Overview } from './pages/Overview';
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { TITLE_DEFAULT } from './constants';


export const RouterInner = () => {

  const { pathname } = useLocation();

  // scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {/* Modal: closed by default */}
      <Modal />

      {/* App related messages for UI control */}
      <MessagesContextWrapper>
        <BodyInterfaceWrapper>

          {/* Assistant: closed by default */}
          <Assistant />

          {/* Left side menu */}
          <SideInterfaceWrapper>
            <SideMenu />
          </SideInterfaceWrapper>

          {/* Main Content Window */}
          <MainInterfaceWrapper>
            <Headers />

            <AnimatePresence>
              <Routes>
                {PAGES_CONFIG.map((page, pageIndex) => {
                  const { Entry } = page;
                  return (
                    <Route
                      key={`main_interface_page_${pageIndex}`}
                      path={page.uri}
                      element={

                        <PageWrapper
                          key={`main_interface_key__${pageIndex}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            duration: 0.8,
                            type: "spring",
                            bounce: 0.4
                          }}
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
                  path='/'
                  element={
                    <PageWrapper
                      key={`main_interface_key__default`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        bounce: 0.4
                      }}
                    >
                      <Overview page={PAGES_CONFIG[0]} />
                    </PageWrapper>
                  }
                />
              </Routes>
            </AnimatePresence>
          </MainInterfaceWrapper>
        </BodyInterfaceWrapper>
      </MessagesContextWrapper>

      {/* Network status and network details */}
      <NetworkBar />

      {/* Testing notification popup */}
      <Notifications />
    </>

  );
}

// We wrap the main router component to make staking metrics available
// to child contexts.
export const Router = () => {

  return (
    <StakingMetricsContextWrapper>
      <BrowserRouter>
        <RouterInner />
      </BrowserRouter>
    </StakingMetricsContextWrapper>
  );
}

export default Router;