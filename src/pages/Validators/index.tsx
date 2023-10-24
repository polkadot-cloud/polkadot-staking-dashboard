// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageTitle } from '@polkadot-cloud/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import type { PageTitleTabProps } from '@polkadot-cloud/react/types';
import { AllValidators } from './AllValidators';
import { ValidatorFavorites } from './Favorites';
import { ValidatorsTabsProvider, useValidatorsTabs } from './context';

export const ValidatorsInner = () => {
  const { t } = useTranslation('pages');
  const { favorites } = useFavoriteValidators();
  const { activeTab, setActiveTab } = useValidatorsTabs();

  // back to tab 0 if not in the first tab
  useEffect(() => {
    if (![0].includes(activeTab)) {
      setActiveTab(0);
    }
  }, []);

  let tabs: PageTitleTabProps[] = [
    {
      title: t('validators.allValidators'),
      active: activeTab === 0,
      onClick: () => setActiveTab(0),
    },
  ];

  tabs = tabs.concat({
    title: t('validators.favorites'),
    active: activeTab === 1,
    onClick: () => setActiveTab(1),
    badge: String(favorites.length),
  });

  return (
    <>
      <PageTitle title={t('validators.validators')} tabs={tabs} />
      {activeTab === 0 && <AllValidators />}
      {activeTab === 1 && <ValidatorFavorites />}
    </>
  );
};

export const Validators = () => (
  <ValidatorsTabsProvider>
    <ValidatorsInner />
  </ValidatorsTabsProvider>
);
