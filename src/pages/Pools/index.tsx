// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { StatBoxList } from '../../library/StatBoxList';
import { useNetworkMetrics } from '../../contexts/Network';
import { PageRowWrapper } from '../../Wrappers';
import { GraphWrapper, MainWrapper, SecondaryWrapper } from '../Overview/Wrappers';

export const Pools = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const { metrics } = useNetworkMetrics();

  // counterForValidators

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
      <h1>{title}</h1>
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper>
          <GraphWrapper>
            <h3>Nomination Pools</h3>
            <h4>In progress.</h4>
          </GraphWrapper>
        </MainWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Pools;