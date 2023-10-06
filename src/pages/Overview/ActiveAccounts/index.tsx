// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccount } from 'contexts/Connect/ActiveAccount';
import { Item } from './Item';
import { ActiveAccounsWrapper } from './Wrappers';

export const ActiveAccounts = () => {
  const { activeProxy, activeAccount } = useActiveAccount();

  return (
    <ActiveAccounsWrapper>
      <Item address={activeAccount} />
      {activeProxy && <Item address={activeAccount} delegate={activeProxy} />}
    </ActiveAccounsWrapper>
  );
};
