// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { PageRowWrapper } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { PageTitle } from '../../library/PageTitle';
import { StatBoxList } from '../../library/StatBoxList';

export const Pools = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  const items: any = [
    {
      label: "Active Pools",
      value: 5,
      value2: 5,
      total: 10,
      unit: "",
      tooltip: `50%`,
      format: "chart-pie",
      assistant: {
        page: 'pools',
        key: 'Active Pools'
      }
    },
    {
      label: "Minimum Join Bond",
      value: 10,
      unit: "DOT",
      format: "number",
      assistant: {
        page: 'pools',
        key: 'Era',
      }
    }, {
      label: "Minimum Create Bond",
      value: 10,
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