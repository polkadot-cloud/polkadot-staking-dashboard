// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRow } from '@polkadotcloud/core-ui';
import { useEffect, useState } from 'react';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { Item } from './Item';
import { ItemsWrapper } from './Wrappers';
import { useCommunitySections } from './context';

export const List = () => {
  const { network } = useApi();
  const { validatorCommunity } = useValidators();
  const { scrollPos } = useCommunitySections();

  const [entityItems, setEntityItems] = useState(
    validatorCommunity.filter((v) => v.validators[network.name] !== undefined)
  );

  useEffect(() => {
    setEntityItems(
      validatorCommunity.filter((v) => v.validators[network.name] !== undefined)
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
        {entityItems.map((item: any, index: number) => (
          <Item key={`community_item_${index}`} item={item} actionable />
        ))}
      </ItemsWrapper>
    </PageRow>
  );
};
