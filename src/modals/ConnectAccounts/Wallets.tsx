// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';
import { useConnect } from '../../contexts/Connect';
import { Separator } from './Wrapper';
import { useModal } from '../../contexts/Modal';
import { Wallet } from './Wallet';

export const Wallets = (props: any) => {
  const { setSection } = props;

  const modal = useModal();
  const { extensions, activeWallet, activeAccount, walletErrors }: any =
    useConnect();

  let { accounts } = useConnect();

  // remove active account from connect list
  accounts = accounts.filter((item: any) => item.address !== activeAccount);

  // trigger modal resize on extensions change
  useEffect(() => {
    modal.setResize();
  }, [extensions]);

  // remove active wallet from extensions list
  const activeExtension =
    extensions.find((wallet: any) => wallet.extensionName === activeWallet) ??
    null;
  const extensionsList = extensions.filter(
    (wallet: any) => wallet.extensionName !== activeWallet
  );

  return (
    <>
      <h2>Select Wallet</h2>

      {activeExtension !== null && (
        <Wallet
          flag="Accounts"
          wallet={activeExtension}
          disabled={false}
          error={false}
          setSection={setSection}
          disconnect
        />
      )}
      <Separator />

      {activeExtension !== null && (
        <Wallet
          flag="Accounts"
          wallet={activeExtension}
          disabled={false}
          error={false}
          setSection={setSection}
        />
      )}

      {extensionsList.map((wallet: any) => {
        const error = walletErrors[wallet.name] ?? null;
        const disabled = activeWallet !== wallet.name && activeWallet !== null;
        return (
          <Wallet
            wallet={wallet}
            disabled={disabled}
            error={error}
            setSection={setSection}
          />
        );
      })}
    </>
  );
};
