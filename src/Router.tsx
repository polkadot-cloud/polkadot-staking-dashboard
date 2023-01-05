// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PAGES_CONFIG } from 'config/pages';
import { DefaultLocale, DefaultNetwork, TitleDefault } from 'consts';
import { useApi } from 'contexts/Api';
import { useUi } from 'contexts/UI';
import { AnimatePresence } from 'framer-motion';
import { ErrorFallbackApp, ErrorFallbackRoutes } from 'library/ErrorBoundary';
import { Headers } from 'library/Headers';
import { Help } from 'library/Help';
import { Menu } from 'library/Menu';
import { NetworkBar } from 'library/NetworkBar';
import Notifications from 'library/Notifications';
import { Overlay } from 'library/Overlay';
import SideMenu from 'library/SideMenu';
import { Tooltip } from 'library/Tooltip';
import { getActiveLanguage } from 'locale/utils';
import { Modal } from 'modals';
import { useEffect, useRef, useState } from 'react';
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
import { extractUrlValue } from 'Utils';
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
  const { t } = useTranslation('base');

  const [urlNetworkExists, setUrlNetworkExists] = useState<boolean>(false);
  const [urlNetwork, setUrlNetwork] = useState<any>('');
  const [urlLngExists, setUrlLngExists] = useState<boolean>(false);
  const [urlLng, setUrlLng] = useState<any>('');

  // staking.polkadot.network?n=polkadot&l=fr'
  useEffect(() => {
    const urlNetworkSource = extractUrlValue('n');
    if (
      (urlNetworkSource && urlNetworkSource === 'polkadot') ||
      'kusama' ||
      'westend'
    ) {
      setUrlNetworkExists(true);
      setUrlNetwork(urlNetworkSource);
    }
    const _network = urlNetworkExists
      ? urlNetwork
      : network
      ? network.name
      : DefaultNetwork;

    // localStorage.setItem('network', _network);

    switch (_network) {
      case 'kusama':
        changeFavicon('kusama');
        break;
      case 'westend':
        changeFavicon('westend');
        break;
      default:
        changeFavicon('polkadot');
    }

    const urlLngSource = extractUrlValue('l');
    if ((urlLngSource && urlLngSource === 'cn') || 'en') {
      setUrlLngExists(true);
      setUrlLng(urlLngSource);
    }
    const _lng = urlLngExists
      ? urlLng
      : getActiveLanguage()
      ? getActiveLanguage()
      : DefaultLocale;
  }, []);

  const changeFavicon = (networkName: string) => {
    const currentFavicons = document.querySelectorAll("link[rel*='icon']");
    currentFavicons.forEach((e) => e.parentNode?.removeChild(e)); // get href only
    const newFavicons = document.createElement('link');
    newFavicons.href = networkName;
    document.head.appendChild(newFavicons);
  };

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
      <BodyInterfaceWrapper>
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
        <MainInterfaceWrapper ref={mainInterfaceRef}>
          {/* Fixed headers */}
          <Headers />

          <ErrorBoundary FallbackComponent={ErrorFallbackRoutes}>
            <AnimatePresence>
              <Routes>
                {PAGES_CONFIG.map((page, i) => {
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
                            <title>{`${t(key)} : ${TitleDefault}`}</title>
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
