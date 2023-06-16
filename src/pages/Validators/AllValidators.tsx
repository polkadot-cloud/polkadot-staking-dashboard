// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRow } from '@polkadotcloud/core-ui';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { StatBoxList } from 'library/StatBoxList';
import { ValidatorList } from 'library/ValidatorList';
import { useTranslation } from 'react-i18next';
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
                  batchKey="validators_browse"
                  title={t('validators.networkValidators')}
                  selectable={false}
                  defaultFilters={{
                    includes: ['active'],
                    excludes: [],
                  }}
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
