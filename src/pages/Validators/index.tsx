// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StatBoxList } from 'library/StatBoxList';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { ValidatorList } from 'library/ValidatorList';
import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import ActiveEraStatBox from '../Overview/Stats/ActiveEra';
import TotalValidatorsStatBox from './Stats/TotalValidators';
import ActiveValidatorsStatBox from './Stats/ActiveValidators';
import { PageProps } from '../types';

export const Validators = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const { isReady } = useApi();
  const { validators } = useValidators();

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        <TotalValidatorsStatBox />
        <ActiveValidatorsStatBox />
        <ActiveEraStatBox />
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
