// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt, faCompressAlt } from '@fortawesome/free-solid-svg-icons';
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
import { UIContextInterface } from 'contexts/UI/types';
import { ConnectionStatus } from 'contexts/Api/types';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { ReactComponent as MoonOutlineSVG } from 'img/moon-outline.svg';
import { ReactComponent as SunnyOutlineSVG } from 'img/sunny-outline.svg';
import { Separator, Wrapper, LogoWrapper, ConnectionSymbol } from './Wrapper';
import { Primary } from './Primary';
import { Secondary } from './Secondary';
import Heading from './Heading/Heading';

export const SideMenu = () => {
  const { network, status } = useApi();
  const { mode, toggleTheme } = useTheme();
  const { openModalWith } = useModal();
  const { activeAccount, accounts } = useConnect();
  const { pathname } = useLocation();
  const { getBondedAccount } = useBalances();
  const { getControllerNotImported, inSetup: inNominatorSetup } = useStaking();
  const { membership } = usePoolMemberships();
  const controller = getBondedAccount(activeAccount);
  const {
    isSyncing,
    setSideMenu,
    sideMenuMinimised,
    getPoolSetupProgressPercent,
    getStakeSetupProgressPercent,
    userSideMenuMinimised,
    setUserSideMenuMinimised,
  }: UIContextInterface = useUi();
  const controllerNotImported = getControllerNotImported(controller);

  const [pageConfig, setPageConfig] = useState({
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
    if (!accounts.length) return;

    // inject actions into menu items
    const _pages = Object.assign(pageConfig.pages);
    for (let i = 0; i < _pages.length; i++) {
      const { uri } = _pages[i];

      // set undefined action as default
      _pages[i].action = undefined;

      if (uri === `${URI_PREFIX}/stake`) {
        // configure Stake action
        const warning = !isSyncing && controllerNotImported;
        const staking = !inNominatorSetup();
        const setupPercent = getStakeSetupProgressPercent(activeAccount);

        if (staking) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: 'Active',
          };
        } else if (warning) {
          _pages[i].action = {
            type: 'bullet',
            status: 'warning',
          };
        } else if (setupPercent > 0 && !staking) {
          _pages[i].action = {
            type: 'text',
            status: 'warning',
            text: `${setupPercent}%`,
          };
        }
      }

      if (uri === `${URI_PREFIX}/pools`) {
        // configure Pools action
        const inPool = membership;
        const setupPercent = getPoolSetupProgressPercent(activeAccount);

        if (inPool) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: 'Active',
          };
        } else if (setupPercent > 0 && !inPool) {
          _pages[i].action = {
            type: 'text',
            status: 'warning',
            text: `${setupPercent}%`,
          };
        }
      }
    }
    setPageConfig({
      categories: pageConfig.categories,
      pages: _pages,
    });
  }, [
    network,
    activeAccount,
    accounts,
    controllerNotImported,
    isSyncing,
    membership,
    inNominatorSetup(),
    getStakeSetupProgressPercent(activeAccount),
    getPoolSetupProgressPercent(activeAccount),
  ]);

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

  // handle connection symbol
  const symbolColor =
    status === ConnectionStatus.Connecting
      ? defaultThemes.status.warning.solid[mode]
      : status === ConnectionStatus.Connected
      ? defaultThemes.status.success.solid[mode]
      : defaultThemes.status.danger.solid[mode];

  return (
    <Wrapper ref={ref} minimised={sideMenuMinimised}>
      <section>
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
              <network.brand.icon
                style={{ maxHeight: '100%', width: '2rem' }}
              />
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
              <network.brand.logo.svg
                style={{
                  maxHeight: '100%',
                  height: '100%',
                  width: network.brand.logo.width,
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
                  <Primary
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
        <Separator />
        <Heading title="Network" minimised={sideMenuMinimised} />
        <Secondary
          name={network.name}
          icon={{
            Svg: network.brand.inline.svg,
            size: network.brand.inline.size,
          }}
          minimised={sideMenuMinimised}
          action={
            <ConnectionSymbol color={[symbolColor]} style={{ opacity: 0.7 }} />
          }
        />
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
          <LogoGithubSVG width="1.4rem" height="1.4rem" />
        </button>
        <button
          type="button"
          onClick={() => openModalWith('Settings', {}, 'small')}
        >
          <CogOutlineSVG width="1.6rem" height="1.6rem" />
        </button>

        {mode === 'light' ? (
          <button type="button" onClick={() => toggleTheme()}>
            <SunnyOutlineSVG width="1.7rem" height="1.7rem" />
          </button>
        ) : (
          <button type="button" onClick={() => toggleTheme()}>
            <MoonOutlineSVG width="1.4rem" height="1.4rem" />
          </button>
        )}
      </section>
    </Wrapper>
  );
};

export default SideMenu;
