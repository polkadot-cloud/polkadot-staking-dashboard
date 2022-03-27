// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useNetworkMetrics } from '../../contexts/Network';
import { useStakingMetrics } from '../../contexts/Staking';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { ValidatorList } from '../../library/ValidatorList';
import { PageTitle } from '../../library/PageTitle';
import { PageRowWrapper } from '../../Wrappers';

export const Browse = (props: PageProps) => {

  const { isReady }: any = useApi();
  const { page } = props;
  const { title } = page;

  const { metrics } = useNetworkMetrics();
  const { validators, fetchSessionValidators }: any = useStakingMetrics();

  useEffect(() => {
    fetchSessionValidators();
  }, [isReady()]);

  const items = [
    {
      label: "Active Validators",
      value: 297,
      unit: "",
      format: "number",
    },
    {
      label: "Current Epoch",
      value: 1,
      unit: "",
      format: "number",
    },
    {
      label: "Current Era",
      value: metrics.activeEra.index,
      unit: "",
      format: "number",
    },
  ];

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList title="This Session" items={items} />
      <PageRowWrapper>
        <SectionWrapper>
          <h3>Browse Active Validators</h3>
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