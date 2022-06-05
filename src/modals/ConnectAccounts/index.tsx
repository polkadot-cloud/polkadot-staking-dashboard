// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { ConnectContextInterface } from 'types/connect';
import { Wrapper, CardsWrapper } from './Wrappers';
import { Extensions } from './Extensions';
import { Accounts } from './Accounts';

export const ConnectAccounts = () => {
  const modal = useModal();
  const { activeAccount, extensions, getExtensionsAccounts } =
    useConnect() as ConnectContextInterface;
  let { accounts } = useConnect() as ConnectContextInterface;
  const { config } = modal;
  const _section = config?.section ?? null;

  // active section of modal
  const [section, setSection] = useState(
    _section !== null ? _section : activeAccount !== null ? 1 : 0
  );

  // resize modal on state change
  const extensionsRef: any = useRef(null);
  const accountsRef: any = useRef(null);

  const resizeModal = () => {
    let _height = 0;
    if (section === 0) {
      _height = extensionsRef.current?.clientHeight ?? 0;
    } else {
      _height = accountsRef.current?.clientHeight ?? 0;
    }
    modal.setModalHeight(_height);
  };

  useEffect(() => {
    resizeModal();
  }, [section, activeAccount, accounts, extensions]);

  useEffect(() => {
    getExtensionsAccounts();
  }, []);

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  return (
    <Wrapper>
      <CardsWrapper
        animate={section === 0 ? 'home' : 'next'}
        initial={false}
        transition={{
          duration: 0.5,
          type: 'spring',
          bounce: 0.1,
        }}
        variants={{
          home: {
            left: 0,
          },
          next: {
            left: '-100%',
          },
        }}
      >
        <Extensions setSection={setSection} ref={extensionsRef} />
        <Accounts setSection={setSection} ref={accountsRef} />
      </CardsWrapper>
    </Wrapper>
  );
};

export default ConnectAccounts;
