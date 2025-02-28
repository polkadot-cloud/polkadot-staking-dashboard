// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PageRow } from 'kits/Structure/PageRow';
import { useEffect, useState } from 'react';
import { useNetwork } from 'contexts/Network';
import { Item } from './Item';
import { ItemsWrapper } from './Wrappers';
import { useCommunitySections } from './context';
import type { ValidatorEntry } from '@w3ux/validator-assets';
import { useCommunity } from 'contexts/Community';

export const List = () => {
  const { network } = useNetwork();
  const { scrollPos } = useCommunitySections();
  const { validatorCommunity } = useCommunity();

  const [entityItems, setEntityItems] = useState<ValidatorEntry[]>(
    validatorCommunity.filter((v) => v.validators[network] !== undefined)
  );

  useEffect(() => {
    setEntityItems(
      validatorCommunity.filter((v) => v.validators[network] !== undefined)
    );
  }, [network]);

  useEffect(() => {
    window.scrollTo(0, scrollPos);
  }, [scrollPos]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: scrollPos ? 0 : 0.5,
        staggerChildren: scrollPos ? 0 : 0.025,
      },
    },
  };

  return (
    <PageRow yMargin>
      <ItemsWrapper variants={container} initial="hidden" animate="show">
        {entityItems.map((item, index: number) => (
          <Item key={`community_item_${index}`} item={item} actionable />
        ))}
      </ItemsWrapper>
    </PageRow>
  );
};
