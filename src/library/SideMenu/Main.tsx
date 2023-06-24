// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageCategories, PagesConfig } from 'config/pages';
import { BaseURL, PolkadotUrl } from 'consts';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useSetup } from 'contexts/Setup';
import type { SetupContextInterface } from 'contexts/Setup/types';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import type { UIContextInterface } from 'contexts/UI/types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { PageCategory, PageItem, PagesConfigItems } from 'types';
import { Heading } from './Heading/Heading';
import { Primary } from './Primary';
import { LogoWrapper } from './Wrapper';

export const Main = () => {
  const { t, i18n } = useTranslation('base');
  const { network } = useApi();
  const { activeAccount, accounts } = useConnect();
  const { pathname } = useLocation();
  const { getBondedAccount } = useBonded();
  const { inSetup: inNominatorSetup, addressDifferentToStash } = useStaking();
  const { membership } = usePoolMemberships();
  const controller = getBondedAccount(activeAccount);
  const {
    onNominatorSetup,
    onPoolSetup,
    getPoolSetupPercent,
    getNominatorSetupPercent,
  }: SetupContextInterface = useSetup();
  const { isSyncing, sideMenuMinimised }: UIContextInterface = useUi();
  const controllerDifferentToStash = addressDifferentToStash(controller);

  const [pageConfig, setPageConfig] = useState({
    categories: Object.assign(PageCategories),
    pages: Object.assign(PagesConfig),
  });

  useEffect(() => {
    if (!accounts.length) return;

    // inject actions into menu items
    const _pages = Object.assign(pageConfig.pages);
    for (let i = 0; i < _pages.length; i++) {
      const { uri } = _pages[i];

      // set undefined action as default
      _pages[i].action = undefined;
      if (uri === `${BaseURL}/`) {
        const warning = !isSyncing && controllerDifferentToStash;
        if (warning) {
          _pages[i].action = {
            type: 'bullet',
            status: 'warning',
          };
        }
      }

      if (uri === `${BaseURL}/nominate`) {
        // configure Stake action
        const staking = !inNominatorSetup();
        const warning = !isSyncing && controllerDifferentToStash;
        const setupPercent = getNominatorSetupPercent(activeAccount);

        if (staking) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
          };
        }
        if (warning) {
          _pages[i].action = {
            type: 'bullet',
            status: 'warning',
          };
        }
        if (!staking && (onNominatorSetup || setupPercent > 0)) {
          _pages[i].action = {
            type: 'text',
            status: 'warning',
            text: `${setupPercent}%`,
          };
        }
      }

      if (uri === `${BaseURL}/pools`) {
        // configure Pools action
        const inPool = membership;
        const setupPercent = getPoolSetupPercent(activeAccount);

        if (inPool) {
          _pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
          };
        }
        if (!inPool && (setupPercent > 0 || onPoolSetup)) {
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
    controllerDifferentToStash,
    isSyncing,
    membership,
    inNominatorSetup(),
    getNominatorSetupPercent(activeAccount),
    getPoolSetupPercent(activeAccount),
    i18n.resolvedLanguage,
    onNominatorSetup,
    onPoolSetup,
  ]);

  // remove pages that network does not support
  const pagesToDisplay: PagesConfigItems = Object.values(pageConfig.pages);

  return (
    <>
      <LogoWrapper
        $minimised={sideMenuMinimised}
        onClick={() => window.open(PolkadotUrl, '_blank')}
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
              ({ category, hash, key, lottie, action }: PageItem) => (
                <React.Fragment key={`sidemenu_page_${categoryId}_${key}`}>
                  {category === categoryId && (
                    <Primary
                      name={t(key)}
                      to={hash}
                      active={hash === pathname}
                      lottie={lottie}
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
