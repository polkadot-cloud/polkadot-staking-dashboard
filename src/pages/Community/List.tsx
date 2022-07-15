// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from 'Wrappers';
import { VALIDATOR_COMMUNITY } from 'config/validators';
import { ItemsWrapper } from './Wrappers';
import { Item } from './Item';

export const List = () => {
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
    <PageRowWrapper className="page-padding">
      <ItemsWrapper variants={container} initial="hidden" animate="show">
        {VALIDATOR_COMMUNITY.map((item: any, index: number) => {
          return (
            <Item key={`community_item_${index}`} item={item} actionable />
          );
        })}
      </ItemsWrapper>
    </PageRowWrapper>
  );
};

export default List;
