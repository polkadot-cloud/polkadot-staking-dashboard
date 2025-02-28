// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PageCategories, PagesConfig } from 'config/pages';
import { PolkadotUrl } from 'consts';
import { useBonded } from 'contexts/Bonded';
import { useSetup } from 'contexts/Setup';
import type { SetupContextInterface } from 'contexts/Setup/types';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import type { UIContextInterface } from 'contexts/UI/types';
import type { AnyJson, PageCategory, PageItem, PagesConfigItems } from 'types';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { Heading } from './Heading/Heading';
import { Primary } from './Primary';
import { LogoWrapper } from './Wrapper';
import { useBalances } from 'contexts/Balances';
import { useSyncing } from 'hooks/useSyncing';

export const Main = () => {
  const { t, i18n } = useTranslation('base');
  const { pathname } = useLocation();
  const { syncing } = useSyncing('*');
  const { networkData } = useNetwork();
  const { getBondedAccount } = useBonded();
  const { accounts } = useImportedAccounts();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const { inSetup: inNominatorSetup, addressDifferentToStash } = useStaking();
  const {
    onNominatorSetup,
    onPoolSetup,
    getPoolSetupPercent,
    getNominatorSetupPercent,
  }: SetupContextInterface = useSetup();
  const { sideMenuMinimised }: UIContextInterface = useUi();

  const membership = getPoolMembership(activeAccount);
  const controller = getBondedAccount(activeAccount);
  const controllerDifferentToStash = addressDifferentToStash(controller);

  const [pageConfig, setPageConfig] = useState<AnyJson>({
    categories: Object.assign(PageCategories),
    pages: Object.assign(PagesConfig),
  });

  useEffect(() => {
    if (!accounts.length) {
      return;
    }

    // inject actions into menu items
    const pages = Object.assign(pageConfig.pages);

    let i = 0;
    for (const { uri } of pages) {
      // set undefined action as default
      pages[i].action = undefined;
      if (uri === `${import.meta.env.BASE_URL}`) {
        const warning = !syncing && controllerDifferentToStash;
        if (warning) {
          pages[i].action = {
            type: 'bullet',
            status: 'warning',
          };
        }
      }

      if (uri === `${import.meta.env.BASE_URL}nominate`) {
        // configure Stake action
        const staking = !inNominatorSetup();
        const warning = !syncing && controllerDifferentToStash;
        const setupPercent = getNominatorSetupPercent(activeAccount);

        if (staking) {
          pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
          };
        }
        if (warning) {
          pages[i].action = {
            type: 'bullet',
            status: 'warning',
          };
        }
        if (!staking && (onNominatorSetup || setupPercent > 0)) {
          pages[i].action = {
            type: 'text',
            status: 'warning',
            text: `${setupPercent}%`,
          };
        }
      }

      if (uri === `${import.meta.env.BASE_URL}pools`) {
        // configure Pools action
        const inPool = membership;
        const setupPercent = getPoolSetupPercent(activeAccount);

        if (inPool) {
          pages[i].action = {
            type: 'text',
            status: 'success',
            text: t('active'),
          };
        }
        if (!inPool && (setupPercent > 0 || onPoolSetup)) {
          pages[i].action = {
            type: 'text',
            status: 'warning',
            text: `${setupPercent}%`,
          };
        }
      }
      i++;
    }

    setPageConfig({
      categories: pageConfig.categories,
      pages,
    });
  }, [
    networkData,
    activeAccount,
    accounts,
    controllerDifferentToStash,
    syncing,
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
          <networkData.brand.icon
            style={{ maxHeight: '100%', width: '2rem' }}
          />
        ) : (
          <networkData.brand.logo.svg
            style={{
              maxHeight: '100%',
              height: '100%',
              width: networkData.brand.logo.width,
            }}
          />
        )}
      </LogoWrapper>

      {pageConfig.categories.map(
        ({ id: categoryId, key: categoryKey }: PageCategory) => (
          <Fragment key={`sidemenu_category_${categoryId}`}>
            {/* display heading if not `default` (used for top links) */}
            {categoryKey !== 'default' && (
              <Heading title={t(categoryKey)} minimised={sideMenuMinimised} />
            )}

            {/* display category links */}
            {pagesToDisplay.map(
              ({ category, hash, key, lottie, action }: PageItem) => (
                <Fragment key={`sidemenu_page_${categoryId}_${key}`}>
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
                </Fragment>
              )
            )}
          </Fragment>
        )
      )}
    </>
  );
};
