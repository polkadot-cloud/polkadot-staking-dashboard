// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useValidators } from '../../contexts/Validators/Validators';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';

import ActiveEraStatBox from '../../library/StatBoxList/StatBox/AvtiveEra';
import TotalValidatorsStatBox from '../../library/StatBoxList/StatBox/TotalValidators';
import ActiveValidatorsStatBox from '../../library/StatBoxList/StatBox/ActiveValidators';

export const Validators = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const { isReady }: any = useApi();
  const { validators } = useValidators();
  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        <TotalValidatorsStatBox />
        <ActiveValidatorsStatBox />
        <ActiveEraStatBox />
      </StatBoxList>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          {isReady && (
            <>
              {validators.length === 0 && (
                <div className="item">
                  <h4>Fetching validators...</h4>
                </div>
              )}

              {validators.length > 0 && (
                <ValidatorList
                  validators={validators}
                  batchKey="validators_browse"
                  title="Validators"
                  allowMoreCols
                  allowFilters
                  pagination
                  toggleFavourites
                />
              )}
            </>
          )}
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Validators;
