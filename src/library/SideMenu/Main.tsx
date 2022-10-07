// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useConnect } from 'contexts/Connect';
import { useUi } from 'contexts/UI';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { URI_PREFIX, POLKADOT_URL } from 'consts';
import { PAGE_CATEGORIES, PAGES_CONFIG } from 'config/pages';
import { UIContextInterface } from 'contexts/UI/types';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { PageCategory, PageItem, PagesConfig } from 'types';
import { useTranslation } from 'react-i18next';
import { LogoWrapper } from './Wrapper';
import { Primary } from './Primary';
import Heading from './Heading/Heading';

export const Main = () => {
  const { network } = useApi();
  const { activeAccount, accounts } = useConnect();
  const { pathname } = useLocation();
  const { getBondedAccount } = useBalances();
  const { getControllerNotImported, inSetup: inNominatorSetup } = useStaking();
  const { membership } = usePoolMemberships();
  const controller = getBondedAccount(activeAccount);
  const {
    isSyncing,
    sideMenuMinimised,
    getPoolSetupProgressPercent,
    getStakeSetupProgressPercent,
  }: UIContextInterface = useUi();
  const controllerNotImported = getControllerNotImported(controller);
  const { i18n, t: tCommon } = useTranslation('common');
  const { t: tPages } = useTranslation('pages');

  const [pageConfig, setPageConfig] = useState({
    categories: Object.assign(PAGE_CATEGORIES),
    pages: Object.assign(PAGES_CONFIG),
  });

  useEffect(() => {
    if (!accounts.length) return;

    // inject actions into menu items
    const _pages = Object.assign(pageConfig.pages);
    for (let i = 0; i < _pages.length; i++) {
      const { uri } = _pages[i];

      // set undefined action as default
      _pages[i].action = undefined;

      if (uri === `${URI_PREFIX}/solo`) {
        // configure Stake action
        const warning = !isSyncing && controllerNotImported;
        const staking = !inNominatorSetup();
        const setupPercent = getStakeSetupProgressPercent(activeAccount);

        if (staking) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: tCommon('library.active'),
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
            text: tCommon('library.active'),
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

  // remove pages that network does not support
  const pagesToDisplay: PagesConfig = Object.values(pageConfig.pages);

  return (
    <>
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
            <network.brand.icon style={{ maxHeight: '100%', width: '2rem' }} />
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

      {pageConfig.categories.map(
        (category: PageCategory, categoryIndex: number) => {
          return (
            <React.Fragment key={`sidemenu_category_${categoryIndex}`}>
              {/* display heading if not `default` (used for top links) */}
              {category.key !== 'default' && (
                <Heading
                  title={tPages(category.key)}
                  minimised={sideMenuMinimised}
                />
              )}

              {/* display category links */}
              {pagesToDisplay.map((page: PageItem, pageIndex: number) => {
                return (
                  <React.Fragment key={`sidemenu_page_${pageIndex}`}>
                    {page.category === category._id && (
                      <Primary
                        name={
                          i18n.resolvedLanguage === 'en'
                            ? page.title
                            : page.ctitle
                        }
                        to={page.hash}
                        active={page.hash === pathname}
                        icon={
                          page.icon ? (
                            <FontAwesomeIcon
                              icon={page.icon}
                              transform="grow-1"
                              className="fa-icon"
                            />
                          ) : undefined
                        }
                        animate={page.animate}
                        action={page.action}
                        minimised={sideMenuMinimised}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        }
      )}
    </>
  );
};
