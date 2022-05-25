// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { Wrapper } from './Wrapper';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import { Wallets } from './Wallets';
import { Accounts } from './Accounts';

export const ConnectAccounts = () => {
  const modal = useModal();
  const { activeWallet, activeAccount, extensions }: any = useConnect();
  let { accounts } = useConnect();

  const { config } = modal;
  const _section = config?.section ?? null;

  // active section of modal
  const [section, setSection] = useState(
    _section !== null ? _section : activeAccount !== null ? 1 : 0
  );

  // resize modal on state change
  const heightRef: any = useRef(null);
  useEffect(() => {
    modal.setModalHeight(heightRef.current?.clientHeight ?? 'auto');
  }, [section, activeAccount, activeAccount, accounts, extensions]);

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  // back to wallet section if none active
  useEffect(() => {
    if (activeWallet === null) {
      setSection(0);
    }
  }, [activeWallet]);

  return (
    <Wrapper ref={heightRef}>
      {section === 0 && <Wallets setSection={setSection} />}
      {section === 1 && <Accounts setSection={setSection} />}
    </Wrapper>
  );
};

export default ConnectAccounts;
