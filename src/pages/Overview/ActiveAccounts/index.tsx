// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useConnect } from 'contexts/Connect';
import { Item } from './Item';
import { ActiveAccounsWrapper } from './Wrappers';

export const ActiveAccounts = () => {
  const { activeAccount, activeProxy } = useConnect();

  return (
    <ActiveAccounsWrapper>
      <Item address={activeAccount} />
      {activeProxy && <Item address={activeAccount} delegate={activeProxy} />}
    </ActiveAccounsWrapper>
  );
};
