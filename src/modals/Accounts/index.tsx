// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useConnect } from 'contexts/Connect';
import { ImportedAccount } from 'contexts/Connect/types';
import { useExtensions } from 'contexts/Extensions';
import { useModal } from 'contexts/Modal';
import { useEffect } from 'react';
import { Accounts as AccountsInner } from './Accounts';

export const Accounts = () => {
  const { setResize, height } = useModal();
  const { extensions } = useExtensions();
  const { activeAccount } = useConnect();
  let { accounts } = useConnect();

  useEffect(() => {
    setResize();
  }, [activeAccount, accounts, extensions, height]);

  // remove active account from connect list
  accounts = accounts.filter(
    (item: ImportedAccount) => item.address !== activeAccount
  );

  return <AccountsInner />;
};
