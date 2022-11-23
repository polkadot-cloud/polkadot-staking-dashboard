// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { StatBoxList } from 'library/StatBoxList';
import { ValidatorList } from 'library/ValidatorList';
import { useTranslation } from 'react-i18next';
import { PageRowWrapper } from 'Wrappers';
import { PageProps } from '../types';
import ActiveValidatorsStatBox from './Stats/ActiveValidators';
import AverageCommissionStatBox from './Stats/AverageCommission';
import TotalValidatorsStatBox from './Stats/TotalValidators';

export const Validators = (props: PageProps) => {
  const { page } = props;
  const { key } = page;

  const { isReady } = useApi();
  const { validators } = useValidators();
  const { t } = useTranslation('base');
  const defaultFilters = [
    'inactive',
    'over_subscribed',
    'all_commission',
    'blocked_nominations',
  ];

  return (
    <>
      <PageTitle title={t(key)} />
      <StatBoxList>
        <TotalValidatorsStatBox />
        <ActiveValidatorsStatBox />
        <AverageCommissionStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {!isReady ? (
            <div className="item">
              <h3>Connecting...</h3>
            </div>
          ) : (
            <>
              {validators.length === 0 && (
                <div className="item">
                  <h3>Fetching validators...</h3>
                </div>
              )}

              {validators.length > 0 && (
                <ValidatorList
                  bondType="stake"
                  validators={validators}
                  batchKey="validators_browse"
                  title="Network Validators"
                  selectable={false}
                  defaultFilters={defaultFilters}
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
      </PageRowWrapper>
    </>
  );
};

export default Validators;
