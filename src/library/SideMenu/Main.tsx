// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PAGES_CONFIG, PAGE_CATEGORIES } from 'config/pages';
import { PolkadotUrl, UriPrefix } from 'consts';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { UIContextInterface } from 'contexts/UI/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PageCategory, PageItem, PagesConfig } from 'types';
import Heading from './Heading/Heading';
import { Primary } from './Primary';
import { LogoWrapper } from './Wrapper';

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
  const { t } = useTranslation('base');

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

      if (uri === `${UriPrefix}/nominate`) {
        // configure Stake action
        const warning = !isSyncing && controllerNotImported;
        const staking = !inNominatorSetup();
        const setupPercent = getStakeSetupProgressPercent(activeAccount);

        if (staking) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
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

      if (uri === `${UriPrefix}/pools`) {
        // configure Pools action
        const inPool = membership;
        const setupPercent = getPoolSetupProgressPercent(activeAccount);

        if (inPool) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
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
          window.open(PolkadotUrl, '_blank');
        }}
        minimised={sideMenuMinimised}
      >
        {sideMenuMinimised ? (
          <network.brand.icon style={{ maxHeight: '100%', width: '2rem' }} />
        ) : (
          <>
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
        ({ id: categoryId, key: categoryKey }: PageCategory) => (
          <React.Fragment key={`sidemenu_category_${categoryId}`}>
            {/* display heading if not `default` (used for top links) */}
            {categoryKey !== 'default' && (
              <Heading title={t(categoryKey)} minimised={sideMenuMinimised} />
            )}

            {/* display category links */}
            {pagesToDisplay.map(
              ({ category, hash, icon, key, animate, action }: PageItem) => (
                <React.Fragment key={`sidemenu_page_${categoryId}_${key}`}>
                  {category === categoryId && (
                    <Primary
                      name={t(key)}
                      to={hash}
                      active={hash === pathname}
                      icon={
                        icon ? (
                          <FontAwesomeIcon
                            icon={icon}
                            transform="grow-1"
                            className="fa-icon"
                          />
                        ) : undefined
                      }
                      animate={animate}
                      action={action}
                      minimised={sideMenuMinimised}
                    />
                  )}
                </React.Fragment>
              )
            )}
          </React.Fragment>
        )
      )}
    </>
  );
};
