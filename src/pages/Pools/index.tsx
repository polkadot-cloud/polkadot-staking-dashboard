// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { PageProps } from '../types';
import { PageRowWrapper } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { PageTitle } from '../../library/PageTitle';
import { StatBoxList } from '../../library/StatBoxList';
import { defaultIfNaN } from '../../Utils';

export const Pools = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const [state] = useState({
    activePools: 5,
    totalPools: 10,
    minJoinBond: 10,
    minCreateBond: 10,
  });

  let activePoolsAsPercent = defaultIfNaN(((state.activePools ?? 0) / (state.totalPools * 0.01)).toFixed(2), 0);

  const items: any = [
    {
      label: "Active Pools",
      value: state.activePools,
      value2: state.totalPools - state.activePools,
      total: state.totalPools,
      unit: "",
      tooltip: `${activePoolsAsPercent}%`,
      format: "chart-pie",
      assistant: {
        page: 'pools',
        key: 'Active Pools'
      }
    },
    {
      label: "Minimum Join Bond",
      value: state.minJoinBond,
      unit: "DOT",
      format: "number",
      assistant: {
        page: 'pools',
        key: 'Era',
      }
    }, {
      label: "Minimum Create Bond",
      value: state.minCreateBond,
      unit: "DOT",
      format: "number",
      assistant: {
        page: 'pools',
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
          <h2>Nomination Pools</h2>
          <h4>In progress.</h4>
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Pools;