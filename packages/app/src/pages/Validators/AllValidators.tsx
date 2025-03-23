// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { ValidatorList } from 'library/ValidatorList'
import { useTranslation } from 'react-i18next'
import { Page, Stat } from 'ui-core/base'
import { ActiveValidators } from './Stats/ActiveValidators'
import { AverageCommission } from './Stats/AverageCommission'
import { TotalValidators } from './Stats/TotalValidators'

export const AllValidators = () => {
  const { t } = useTranslation('pages')
  const { isReady } = useApi()
  const { getValidators } = useValidators()
  const validators = getValidators()

  return (
    <>
      <Stat.Row>
        <ActiveValidators />
        <TotalValidators />
        <AverageCommission />
      </Stat.Row>
      <Page.Row>
        <CardWrapper>
          {!isReady ? (
            <div className="item">
              <h3>{t('connecting')}...</h3>
            </div>
          ) : (
            <>
              {validators.length === 0 && (
                <div className="item">
                  <h3>{t('fetchingValidators')}...</h3>
                </div>
              )}
              {validators.length > 0 && (
                <ValidatorList
                  bondFor="nominator"
                  validators={validators}
                  title={t('networkValidators')}
                  selectable={false}
                  defaultFilters={{
                    includes: ['active'],
                    excludes: [
                      'all_commission',
                      'blocked_nominations',
                      'missing_identity',
                    ],
                  }}
                  defaultOrder="rank"
                  allowListFormat={false}
                  allowMoreCols
                  allowFilters
                  allowSearch
                  itemsPerPage={50}
                  toggleFavorites
                />
              )}
            </>
          )}
        </CardWrapper>
      </Page.Row>
    </>
  )
}
