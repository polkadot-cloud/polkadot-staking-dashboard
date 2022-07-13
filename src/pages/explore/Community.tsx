// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageTitle } from 'library/PageTitle';
import { PageRowWrapper } from 'Wrappers';
import { PageProps } from '../types';
import { Wrapper, ItemsWrapper } from './Wrappers';
import { Item } from './Item';

export const Community = (props: PageProps) => {
  const { page } = props;
  const { title } = page;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <Wrapper>
      <PageTitle title={`${title}`} />

      <PageRowWrapper className="page-padding">
        <ItemsWrapper variants={container} initial="hidden" animate="show">
          <Item />
          <Item />
          <Item />
          <Item />
          <Item />
        </ItemsWrapper>
      </PageRowWrapper>
    </Wrapper>
  );
};

export default Community;
