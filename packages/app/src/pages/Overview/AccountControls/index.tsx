// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Item } from './Item';
import { ActiveAccounsWrapper } from './Wrappers';

export const AccountControls = () => {
  const { activeProxy, activeAccount } = useActiveAccounts();

  return (
    <ActiveAccounsWrapper>
      <Item address={activeAccount} />
      {activeProxy && <Item address={activeAccount} delegate={activeProxy} />}
    </ActiveAccounsWrapper>
  );
};
