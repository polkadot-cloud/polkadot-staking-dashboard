// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatBoxList } from 'library/StatBoxList';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { ValidatorList } from 'library/ValidatorList';
import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import { useTranslation } from 'react-i18next';
import AverageCommissionStatBox from './Stats/AverageCommission';
import TotalValidatorsStatBox from './Stats/TotalValidators';
import ActiveValidatorsStatBox from './Stats/ActiveValidators';
import { PageProps } from '../types';

export const Validators = (props: PageProps) => {
  const { page } = props;
  const { key } = page;

  const { isReady } = useApi();
  const { validators } = useValidators();
  const { t: tCommon } = useTranslation('common');
  const { t: tPages } = useTranslation('pages');

  return (
    <>
      <PageTitle title={tPages(key)} />
      <StatBoxList>
        <TotalValidatorsStatBox />
        <ActiveValidatorsStatBox />
        <AverageCommissionStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {!isReady ? (
            <div className="item">
              <h3>{tCommon('pages.validators.connecting')}</h3>
            </div>
          ) : (
            <>
              {validators.length === 0 && (
                <div className="item">
                  <h3>{tCommon('pages.validators.fetching_validators')}</h3>
                </div>
              )}

              {validators.length > 0 && (
                <ValidatorList
                  bondType="stake"
                  validators={validators}
                  batchKey="validators_browse"
                  title={tCommon('pages.validators.network_validators')}
                  selectable={false}
                  allowMoreCols
                  allowFilters
                  allowSearch
                  pagination
                  toggleFavourites
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
