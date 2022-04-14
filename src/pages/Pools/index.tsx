// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { PageRowWrapper } from '../../Wrappers';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { PageTitle } from '../../library/PageTitle';

export const Pools = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  return (
    <>
      <PageTitle title={title} />
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