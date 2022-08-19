// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { ImportedAccount } from 'contexts/Connect/types';
import { Wrapper, CardsWrapper } from './Wrappers';
import { Extensions } from './Extensions';
import { Accounts } from './Accounts';

export const ConnectAccounts = () => {
  const modal = useModal();
  const { activeAccount, extensions } = useConnect();
  let { accounts } = useConnect();

  // toggle read only management
  const [readOnlyOpen, setReadOnlyOpen] = useState(false);

  // resize modal on state change
  const extensionsRef = useRef<HTMLDivElement>(null);
  const accountsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modal.setModalHeight(window.innerHeight);
  }, [
    // section,
    activeAccount,
    accounts,
    extensions,
    modal.height,
    readOnlyOpen,
  ]);

  // remove active account from connect list
  accounts = accounts.filter(
    (item: ImportedAccount) => item.address !== activeAccount
  );

  return (
    <Wrapper>
      <CardsWrapper>
        <Extensions
          readOnlyOpen={readOnlyOpen}
          setReadOnlyOpen={setReadOnlyOpen}
          ref={extensionsRef}
        />
        <Accounts ref={accountsRef} />
      </CardsWrapper>
    </Wrapper>
  );
};

export default ConnectAccounts;
