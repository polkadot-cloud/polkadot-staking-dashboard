// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { useNetworkMetrics } from '../../contexts/Network';
import { PageRowWrapper } from '../../Wrappers';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import { MainWrapper } from '../../library/Layout/Wrappers';

export const Pools = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  return (
    <>
      <h1 className='title'>{title}</h1>
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