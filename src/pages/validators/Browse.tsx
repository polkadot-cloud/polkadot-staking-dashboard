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
import { planckToDot } from '../../Utils';

export const Browse = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const { isReady }: any = useApi();
  const { metrics } = useNetworkMetrics();
  const { validators, staking }: any = useStaking();
  const { minNominatorBond } = staking;

  const items = [
    {
      label: "Validators",
      value: validators.length,
      unit: "",
      format: "number",
    },
    {
      label: "Current Era",
      value: metrics.activeEra.index,
      unit: "",
      format: "number",
    },
    {
      label: "Min Nomination Bond",
      value: planckToDot(minNominatorBond),
      unit: "DOT",
      format: "number",
    },
  ];

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList title="Staking Metrics" items={items} />
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          {isReady() &&
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