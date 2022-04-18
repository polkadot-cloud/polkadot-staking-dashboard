// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useNetworkMetrics } from '../../contexts/Network';
import { useStaking } from '../../contexts/Staking';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';

export const Browse = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const { isReady }: any = useApi();
  const { metrics } = useNetworkMetrics();
  const { validators, staking, eraStakers }: any = useStaking();

  const { totalValidators, maxValidatorsCount, validatorCount } = staking;
  const { activeValidators } = eraStakers;

  const items = [
    {
      label: "Total Validators",
      value: totalValidators,
      value2: maxValidatorsCount - totalValidators ?? 0,
      total: maxValidatorsCount,
      unit: "",
      tooltip: `${((totalValidators ?? 0) / (maxValidatorsCount * 0.01)).toFixed(2)}%`,
      format: "chart",
    },
    {
      label: "Active Validators",
      value: activeValidators,
      value2: validatorCount - activeValidators ?? 0,
      total: validatorCount,
      unit: "",
      tooltip: `${((activeValidators ?? 0) / (validatorCount * 0.01)).toFixed(2)}%`,
      format: "chart",
    },
    {
      label: "Active Era",
      value: metrics.activeEra.index,
      unit: "",
      format: "number",
    }
  ];

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList title="Staking Metrics" items={items} />
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          {isReady &&
            <>
              {validators.length === 0 &&
                <div className='item'>
                  <h4>Fetching validators...</h4>
                </div>
              }

              {validators.length > 0 &&
                <ValidatorList
                  validators={validators}
                  batchKey='validators_browse'
                  layout='col'
                  title='Validators'
                  allowMoreCols
                  allowFilters
                  pagination
                  toggleFavourites
                />
              }
            </>
          }
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Browse;