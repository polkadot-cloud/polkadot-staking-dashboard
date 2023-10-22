// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageRow } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { CardWrapper } from 'library/Card/Wrappers';
import { StatBoxList } from 'library/StatBoxList';
import { ValidatorList } from 'library/ValidatorList';
import { ActiveValidatorsStat } from './Stats/ActiveValidators';
import { AverageCommissionStat } from './Stats/AverageCommission';
import { TotalValidatorsStat } from './Stats/TotalValidators';

export const AllValidators = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { validators } = useValidators();

  return (
    <>
      <StatBoxList>
        <ActiveValidatorsStat />
        <TotalValidatorsStat />
        <AverageCommissionStat />
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
                  pagination
                  toggleFavorites
                />
              )}
            </>
          )}
        </CardWrapper>
      </PageRow>
    </>
  );
};
