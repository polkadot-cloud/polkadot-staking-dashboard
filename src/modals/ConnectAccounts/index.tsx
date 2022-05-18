// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { Wrapper } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import { Wallets } from './Wallets';
import { Accounts } from './Accounts';

export const ConnectAccounts = () => {
  const modal = useModal();

  const { config } = modal;
  const _section = config?.section ?? null;

  const {
    activeWallet,
    activeAccount,
  }: any = useConnect();

  let { accounts } = useConnect();

  // active section of modal
  const [section, setSection] = useState(
    _section !== null ? _section : activeAccount !== null ? 1 : 0,
  );

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  // back to wallet section if none active
  useEffect(() => {
    if (activeWallet === null) {
      setSection(0);
    }
  }, [activeWallet]);

  return (
    <Wrapper>
      {section === 0 && <Wallets setSection={setSection} />}
      {section === 1 && <Accounts setSection={setSection} />}
    </Wrapper>
  );
};

export default ConnectAccounts;
