// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { PageWrapper } from './Wrappers';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion"
import { PAGES_CONFIG } from './pages';
import { StakingMetricsContextWrapper } from './contexts/Staking';
import { MessagesContextWrapper } from './contexts/Messages';
import { UIContextWrapper } from './contexts/UI';
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
import { useUi } from './contexts/UI';
import throttle from 'lodash.throttle';
import { SIDE_MENU_STICKY_THRESHOLD } from './constants';

export const RouterInner = () => {

  const { pathname } = useLocation();
  const { sideMenuOpen, setSideMenu } = useUi();

  // scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  // listen to window resize to hide SideMenu
  useEffect(() => {
    window.addEventListener('resize', windowThrottle);
    return (() => {
      window.removeEventListener("resize", windowThrottle);
    })
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= SIDE_MENU_STICKY_THRESHOLD) {
      setSideMenu(0);
    }
  }
  const windowThrottle = throttle(throttleCallback, 200, { trailing: true, leading: false });

  console.log(sideMenuOpen);

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
          <SideInterfaceWrapper open={sideMenuOpen}>
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
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{
                            duration: 0.2,
                            // type: "spring",
                            // bounce: 0.4
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

// We wrap UI Context around `RouterInner` to give it access to the context.
export const RouterWithUIContext = () => {

  return (
    <UIContextWrapper>
      <RouterInner />
    </UIContextWrapper>
  );
}

// We wrap the main router component to make staking metrics available.
// to child contexts.
export const Router = () => {

  return (
    <StakingMetricsContextWrapper>
      <BrowserRouter>
        <RouterWithUIContext />
      </BrowserRouter>
    </StakingMetricsContextWrapper>
  );
}

export default Router;