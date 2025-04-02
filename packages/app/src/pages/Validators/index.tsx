// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useFavoriteValidators } from 'contexts/Validators/FavoriteValidators'
import { PageTabs } from 'library/PageTabs'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Page } from 'ui-core/base'
import { AllValidators } from './AllValidators'
import { ValidatorFavorites } from './Favorites'
import { ValidatorsTabsProvider, useValidatorsTabs } from './context'

export const ValidatorsInner = () => {
  const { t } = useTranslation('pages')
  const { favorites } = useFavoriteValidators()
  const { activeTab, setActiveTab } = useValidatorsTabs()

  // back to tab 0 if not in the first tab
  useEffect(() => {
    if (![0].includes(activeTab)) {
      setActiveTab(0)
    }
  }, [])

  return (
    <>
      <Page.Title title={t('validators')}>
        <PageTabs
          tabs={[
            {
              title: t('allValidators'),
              active: activeTab === 0,
              onClick: () => setActiveTab(0),
            },
            {
              title: t('favorites'),
              active: activeTab === 1,
              onClick: () => setActiveTab(1),
              badge: String(favorites.length),
            },
          ]}
        />
      </Page.Title>
      {activeTab === 0 && <AllValidators />}
      {activeTab === 1 && <ValidatorFavorites />}
    </>
  )
}

export const Validators = () => (
  <ValidatorsTabsProvider>
    <ValidatorsInner />
  </ValidatorsTabsProvider>
)
