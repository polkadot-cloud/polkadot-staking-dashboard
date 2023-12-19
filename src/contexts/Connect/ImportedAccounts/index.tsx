// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';
import type { MaybeAddress } from 'types';
import type { ExternalAccount } from '@polkadot-cloud/react/types';
import { ManualSigners } from 'consts';
import { useExtensionAccounts } from '@polkadot-cloud/react/hooks';
import { defaultImportedAccountsContext } from './defaults';
import type { ImportedAccountsContextInterface } from './types';
import { useOtherAccounts } from '../OtherAccounts';

export const ImportedAccountsContext =
  createContext<ImportedAccountsContextInterface>(
    defaultImportedAccountsContext
  );

export const ImportedAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { otherAccounts } = useOtherAccounts();
  const { extensionAccounts } = useExtensionAccounts();
  const allAccounts = extensionAccounts.concat(otherAccounts);

  // Gets an account from `allAccounts`.
  //
  // Caches the function when imported accounts update.
  const getAccount = useCallback(
    (who: MaybeAddress) => {
      return allAccounts.find(({ address }) => address === who) || null;
    },
    [allAccounts]
  );

  // Checks if an address is a read-only account.
  //
  // Caches the function when imported accounts update.
  const isReadOnlyAccount = useCallback(
    (address: MaybeAddress) => {
      const account = getAccount(address) ?? {};
      if (Object.prototype.hasOwnProperty.call(account, 'addedBy')) {
        const { addedBy } = account as ExternalAccount;
        return addedBy === 'user';
      }
      return false;
    },
    [allAccounts]
  );

  // Checks whether an account can sign transactions.
  //
  // Caches the function when imported accounts update.
  const accountHasSigner = useCallback(
    (address: MaybeAddress) => {
      return (
        allAccounts.find(
          (account) =>
            account.address === address && account.source !== 'external'
        ) !== undefined
      );
    },
    [allAccounts]
  );

  // Checks whether an account needs manual signing.
  //
  // This is the case for accounts imported from hardware wallets, transactions of which cannot be
  // automatically signed by a provided `signer` as is the case with web extensions.
  //
  // Caches the function when imported accounts update.
  const requiresManualSign = useCallback(
    (address: MaybeAddress) => {
      return (
        allAccounts.find(
          (a) => a.address === address && ManualSigners.includes(a.source)
        ) !== undefined
      );
    },
    [allAccounts]
  );

  return (
    <ImportedAccountsContext.Provider
      value={{
        accounts: allAccounts,
        getAccount,
        isReadOnlyAccount,
        accountHasSigner,
        requiresManualSign,
      }}
    >
      {children}
    </ImportedAccountsContext.Provider>
  );
};

export const useImportedAccounts = () => useContext(ImportedAccountsContext);
