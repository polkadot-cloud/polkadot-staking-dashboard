// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExpandAlt,
  faCompressAlt,
  faPalette,
} from '@fortawesome/free-solid-svg-icons';
import throttle from 'lodash.throttle';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { ReactComponent as CogOutlineSVG } from 'img/cog-outline.svg';
import { ReactComponent as LogoGithubSVG } from 'img/logo-github.svg';
import { URI_PREFIX, POLKADOT_URL, SIDE_MENU_STICKY_THRESHOLD } from 'consts';
import { useOutsideAlerter } from 'library/Hooks';
import { PAGE_CATEGORIES, PAGES_CONFIG } from 'config/pages';
import { ConnectContextInterface } from 'types/connect';
import { usePalette } from 'contexts/Palette';
import Item from './Item';
import Heading from './Heading';
import { Wrapper, LogoWrapper, PalettePosition } from './Wrapper';

export const SideMenu = () => {
  const { network } = useApi();
  const { openModalWith } = useModal();
  const { activeAccount, accounts } = useConnect() as ConnectContextInterface;
  const { pathname }: any = useLocation();
  const { getBondedAccount } = useBalances();
  const { getControllerNotImported } = useStaking();
  const { setPalettePosition, open }: any = usePalette();
  const controller = getBondedAccount(activeAccount);
  const {
    isSyncing,
    setSideMenu,
    sideMenuOpen,
    sideMenuMinimised,
    userSideMenuMinimised,
    setUserSideMenuMinimised,
  }: any = useUi();
  const controllerNotImported = getControllerNotImported(controller);

  const [pageConfig, setPageConfig]: any = useState({
    categories: Object.assign(PAGE_CATEGORIES),
    pages: Object.assign(PAGES_CONFIG),
  });

  // listen to window resize to hide SideMenu
  useEffect(() => {
    window.addEventListener('resize', windowThrottle);
    return () => {
      window.removeEventListener('resize', windowThrottle);
    };
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= SIDE_MENU_STICKY_THRESHOLD) {
      setSideMenu(0);
    }
  };
  const windowThrottle = throttle(throttleCallback, 200, {
    trailing: true,
    leading: false,
  });

  useEffect(() => {
    // only process account messages and warnings once accounts are connected
    if (accounts.length) {
      const _pageConfigWithMessages: any = Object.assign(pageConfig.pages);
      for (let i = 0; i < _pageConfigWithMessages.length; i++) {
        const { uri } = _pageConfigWithMessages[i];

        // on stake menu item, add warning for controller not imported
        if (uri === `${URI_PREFIX}/stake`) {
          _pageConfigWithMessages[i].action =
            !isSyncing && controllerNotImported;
        }
      }
      setPageConfig({
        categories: pageConfig.categories,
        pages: _pageConfigWithMessages,
      });
    }
  }, [network, activeAccount, accounts, controllerNotImported, isSyncing]);

  const ref = useRef(null);
  useOutsideAlerter(ref, () => {
    setSideMenu(0);
  });

  // remove pages that network does not support
  let pagesToDisplay = Object.values(pageConfig.pages);
  if (!network.features.pools) {
    // remove pools
    pagesToDisplay = pagesToDisplay.filter(
      (page: any) => page.hash !== '/pools'
    );
  }

  // toggle palette
  const posRef = useRef(null);
  const togglePalette = () => {
    if (!open) {
      setPalettePosition(posRef);
    }
  };

  return (
    <Wrapper ref={ref} minimised={sideMenuMinimised}>
      <section>
        <button
          type="button"
          className="close-menu"
          style={{
            fontVariationSettings: "'wght' 450",
            margin: '0.2rem 0 1rem 0',
            opacity: 0.7,
          }}
          onClick={() => {
            setSideMenu(sideMenuOpen ? 0 : 1);
          }}
        >
          Close
        </button>

        <LogoWrapper
          onClick={() => {
            window.open(POLKADOT_URL, '_blank');
          }}
          minimised={sideMenuMinimised}
        >
          {sideMenuMinimised ? (
            <>
              <div
                className="beta-min"
                style={{ top: network.name === 'Westend' ? '-5px' : '-10px' }}
              >
                BETA
              </div>
              <network.icon style={{ maxHeight: '100%', width: '2rem' }} />
            </>
          ) : (
            <>
              <div
                className="beta"
                style={{
                  right:
                    network.name === 'Kusama'
                      ? '1.6rem'
                      : network.name === 'Westend'
                      ? '1.25rem'
                      : '0.25rem',
                }}
              >
                Staking | BETA
              </div>
              <network.logo.svg
                style={{
                  maxHeight: '100%',
                  height: '100%',
                  width: network.logo.width,
                }}
              />
            </>
          )}
        </LogoWrapper>

        {pageConfig.categories.map((category: any, categoryIndex: number) => (
          <React.Fragment key={`sidemenu_category_${categoryIndex}`}>
            {/* display heading if not `default` (used for top links) */}
            {category.title !== 'default' && (
              <Heading title={category.title} minimised={sideMenuMinimised} />
            )}

            {/* display category links */}
            {pagesToDisplay.map((page: any, pageIndex: number) => (
              <React.Fragment key={`sidemenu_page_${pageIndex}`}>
                {page.category === category._id && (
                  <Item
                    name={page.title}
                    to={page.hash}
                    active={page.hash === pathname}
                    icon={<FontAwesomeIcon icon={page.icon} />}
                    action={page.action}
                    minimised={sideMenuMinimised}
                  />
                )}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </section>

      <section>
        <button
          type="button"
          onClick={() =>
            setUserSideMenuMinimised(userSideMenuMinimised ? 0 : 1)
          }
        >
          <FontAwesomeIcon
            icon={userSideMenuMinimised ? faExpandAlt : faCompressAlt}
            transform="grow-3"
          />
        </button>
        <button
          type="button"
          onClick={() =>
            window.open(
              'https://github.com/rossbulat/polkadot-staking-experience',
              '_blank'
            )
          }
        >
          <LogoGithubSVG width="1.45rem" height="1.45rem" />
        </button>
        <button
          type="button"
          onClick={() => openModalWith('Settings', {}, 'small')}
        >
          <CogOutlineSVG width="1.65rem" height="1.65rem" />
        </button>
        <button type="button" onClick={() => togglePalette()}>
          <PalettePosition ref={posRef} />
          <FontAwesomeIcon icon={faPalette} transform="grow-5" />
        </button>
      </section>
    </Wrapper>
  );
};

export default SideMenu;
