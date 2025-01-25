// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useApi } from 'contexts/Api'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { StatBoxList } from 'library/StatBoxList'
import { ValidatorList } from 'library/ValidatorList'
import { useTranslation } from 'react-i18next'
import { PageRow } from 'ui-core/base'
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
      <StatBoxList>
        <ActiveValidators />
        <TotalValidators />
        <AverageCommission />
      </StatBoxList>
      <PageRow>
        <CardWrapper>
          {!isReady ? (
            <div className="item">
              <h3>{t('validators.connecting')}...</h3>
            </div>
          ) : (
            <>
              {validators.length === 0 && (
                <div className="item">
                  <h3>{t('validators.fetchingValidators')}...</h3>
                </div>
              )}

              {validators.length > 0 && (
                <ValidatorList
                  bondFor="nominator"
                  validators={validators}
                  title={t('validators.networkValidators')}
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
                  itemsPerPage={30}
                  toggleFavorites
                />
              )}
            </>
          )}
        </CardWrapper>
      </PageRow>
    </>
  )
}
