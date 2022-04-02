// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { PageRowWrapper } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { MainWrapper } from '../../library/Layout';
import { PageTitle } from '../../library/PageTitle';

export const Pools = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  return (
    <>
      <PageTitle title={title} />
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper>
          <SectionWrapper>
            <h3>Nomination Pools</h3>
            <h4>In progress.</h4>
          </SectionWrapper>
        </MainWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Pools;