// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { ItemsWrapper, ItemWrapper } from './Wrappers';

export const Tips = () => {
  const { network } = useApi();

  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h4>
          Tips
          <OpenHelpIcon helpKey="Dashboard Tips" />
        </h4>
      </CardHeaderWrapper>
      <ItemsWrapper
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <Item
          title="How would you like to stake?"
          subtitle="Becoming a nominator or joining a pool - which one is right for you."
        />
        <Item
          title="Managing your Nominations"
          subtitle="You are now staking. Read more about managing your nominations."
        />
        <Item
          title="Reviewing Payouts"
          subtitle="Learn who your best performing nominees are, and update them when needed."
        />
      </ItemsWrapper>
    </CardWrapper>
  );
};

const Item = ({ title, subtitle }: any) => {
  return (
    <ItemWrapper
      type="button"
      whileHover={{ scale: 1.01 }}
      onClick={() => {
        console.log('interact with tip');
      }}
      variants={{
        hidden: {
          y: 15,
          opacity: 0,
        },
        show: {
          y: 0,
          opacity: 1,
        },
      }}
    >
      <div className="inner">
        <h4>{title}</h4>
        <div className="desc">
          <p>{subtitle}</p>
        </div>
      </div>
    </ItemWrapper>
  );
};
