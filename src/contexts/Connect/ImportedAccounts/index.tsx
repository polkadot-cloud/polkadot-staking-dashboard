// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext } from 'react';
import type { MaybeAddress } from 'types';
import type {
  ExternalAccount,
  ImportedAccount,
} from '@w3ux/react-connect-kit/types';
import { ManualSigners } from 'consts';
import { useExtensionAccounts } from '@w3ux/react-connect-kit';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { defaultImportedAccountsContext } from './defaults';
import type { ImportedAccountsContextInterface } from './types';
import { useOtherAccounts } from '../OtherAccounts';
import { BalancesController } from 'static/BalancesController';
import { useApi } from 'contexts/Api';

export const ImportedAccountsContext =
  createContext<ImportedAccountsContextInterface>(
    defaultImportedAccountsContext
  );

export const useImportedAccounts = () => useContext(ImportedAccountsContext);

export const ImportedAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isReady, api } = useApi();
  const { otherAccounts } = useOtherAccounts();
  const { extensionAccounts } = useExtensionAccounts();
  const allAccounts = extensionAccounts.concat(otherAccounts);

  // Stringify account addresses and account names to determine if they have changed. Ignore other properties including `signer` and `source`.
  const shallowAccountStringify = (accounts: ImportedAccount[]) => {
    const sorted = accounts.sort((a, b) => {
      if (a.address < b.address) {
        return -1;
      }
      if (a.address > b.address) {
        return 1;
      }
      return 0;
    });
    return JSON.stringify(
      sorted.map((account) => [account.address, account.name])
    );
  };

  const allAccountsStringified = shallowAccountStringify(allAccounts);

  // Gets an account from `allAccounts`.
  //
  // Caches the function when imported accounts update.
  const getAccount = useCallback(
    (who: MaybeAddress) =>
      allAccounts.find(({ address }) => address === who) || null,
    [allAccountsStringified]
  );

  // Checks if an address is a read-only account.
  //
  // Caches the function when imported accounts update.
  const isReadOnlyAccount = useCallback(
    (who: MaybeAddress) => {
      const account = allAccounts.find(({ address }) => address === who) || {};
      if (Object.prototype.hasOwnProperty.call(account, 'addedBy')) {
        const { addedBy } = account as ExternalAccount;
        return addedBy === 'user';
      }
      return false;
    },
    [allAccountsStringified]
  );

  // Checks whether an account can sign transactions.
  //
  // Caches the function when imported accounts update.
  const accountHasSigner = useCallback(
    (address: MaybeAddress) =>
      allAccounts.find(
        (account) =>
          account.address === address && account.source !== 'external'
      ) !== undefined,
    [allAccountsStringified]
  );

  // Checks whether an account needs manual signing.
  //
  // This is the case for accounts imported from hardware wallets, transactions of which cannot be
  // automatically signed by a provided `signer` as is the case with web extensions.
  //
  // Caches the function when imported accounts update.
  const requiresManualSign = useCallback(
    (address: MaybeAddress) =>
      allAccounts.find(
        (a) => a.address === address && ManualSigners.includes(a.source)
      ) !== undefined,
    [allAccountsStringified]
  );

  // Keep accounts in sync with `BalancesController`.
  useEffectIgnoreInitial(() => {
    if (api && isReady) {
      BalancesController.syncAccounts(
        api,
        allAccounts.map((a) => a.address)
      );
    }
  }, [isReady, allAccountsStringified]);

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
