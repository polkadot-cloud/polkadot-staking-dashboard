// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageWrapper } from './Wrappers';
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion"
import { PAGES_CONFIG } from './pages';
import { StakingMetricsContextWrapper } from './contexts/Staking';
import { NetworkBar } from './library/NetworkBar';
import { Modal } from './library/Modal';
import AssistantButton from './library/Headers';
import SideMenu from './library/SideMenu';
import Assistant from './library/Assistant';
import { BrowserRouter } from "react-router-dom";
import {
  SideInterfaceWrapper,
  MainInterfaceWrapper,
  BodyInterfaceWrapper,
} from './Wrappers';
import Notifications from './library/Notifications';

export const Router = () => {

  return (
    <BrowserRouter>

      {/* Modal: closed by default */}
      <Modal />

      {/* Wrap entire interface with staking metrics provider */}
      <StakingMetricsContextWrapper>
        <BodyInterfaceWrapper>

          {/* Assistant: closed by default */}
          <Assistant />

          {/* Left side menu */}
          <SideInterfaceWrapper>
            <SideMenu />
          </SideInterfaceWrapper>

          {/* Main Content Window */}
          <MainInterfaceWrapper>
            <AssistantButton />

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
                          <Entry page={page} />
                        </PageWrapper>
                      }
                    />
                  )
                })}
              </Routes>
            </AnimatePresence>
          </MainInterfaceWrapper>
        </BodyInterfaceWrapper>

        {/* Network status and network details */}
        <NetworkBar />

        {/* Testing notification popup */}
        <Notifications />

      </StakingMetricsContextWrapper>
    </BrowserRouter>

  );
}

export default Router;