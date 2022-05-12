// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useStaking } from '../../contexts/Staking';
import { useValidators } from '../../contexts/Validators/Validators';
import { useNetworkMetrics } from '../../contexts/Network';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';

export const Browse = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const { isReady }: any = useApi();
  const { metrics } = useNetworkMetrics();
  const { staking, eraStakers }: any = useStaking();
  const { validators } = useValidators();

  const { totalValidators, maxValidatorsCount, validatorCount } = staking;
  const { activeValidators } = eraStakers;

  // total validators as percent
  let totalValidatorsAsPercent = 0;
  if (maxValidatorsCount.gt(new BN(0))) {
    totalValidatorsAsPercent = totalValidators.div(maxValidatorsCount.div(new BN(100))).toNumber();
  }

  // active validators as percent
  let activeValidatorsAsPercent = 0;
  if (validatorCount.gt(new BN(0))) {
    activeValidatorsAsPercent = activeValidators / (validatorCount.toNumber() * 0.01);
  }

  const items = [
    {
      label: "Total Validators",
      value: totalValidators.toNumber(),
      value2: maxValidatorsCount.sub(totalValidators).toNumber(),
      total: maxValidatorsCount.toNumber(),
      unit: "",
      tooltip: `${totalValidatorsAsPercent.toFixed(2)}%`,
      format: "chart-pie",
      assistant: {
        page: 'validators',
        key: 'Validator'
      }
    },
    {
      label: "Active Validators",
      value: activeValidators,
      value2: validatorCount.sub(new BN(activeValidators)).toNumber(),
      total: validatorCount.toNumber(),
      unit: "",
      tooltip: `${activeValidatorsAsPercent.toFixed(2)}%`,
      format: "chart-pie",
      assistant: {
        page: 'validators',
        key: 'Active Validator'
      }
    },
    {
      label: "Active Era",
      value: metrics.activeEra.index,
      unit: "",
      format: "number",
      assistant: {
        page: 'validators',
        key: 'Era',
      }
    }
  ];

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList items={items} />
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