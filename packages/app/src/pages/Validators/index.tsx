// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from 'ui-structure';
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

  return (
    <>
      <PageTitle
        title={t('validators.validators')}
        tabs={[
          {
            title: t('validators.allValidators'),
            active: activeTab === 0,
            onClick: () => setActiveTab(0),
          },
          {
            title: t('validators.favorites'),
            active: activeTab === 1,
            onClick: () => setActiveTab(1),
            badge: String(favorites.length),
          },
        ]}
      />
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
