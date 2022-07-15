// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from 'Wrappers';
import { VALIDATOR_COMMUNITY } from 'config/validators';
import { ItemsWrapper } from './Wrappers';
import { Item } from './Item';

export const List = () => {
  // TODO: add ordering (random, alphabetically ascending or descending) (larger ValidatorList style buttons).
  // TODO: ability to pin validator identities to the top of the list (persist to localStorage).
  // TODO: refer to saveed scroll pos (context) and go to it immediately when activeItem goes back to null.

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
