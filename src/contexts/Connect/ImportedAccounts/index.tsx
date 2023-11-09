// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { MaybeAddress } from 'types';
import type {
  ExternalAccount,
  ImportedAccount,
} from '@polkadot-cloud/react/types';
import { ManualSigners } from 'consts';
import { useExtensionAccounts } from '@polkadot-cloud/react/hooks';
import Keyring from '@polkadot/keyring';
import { useNetwork } from 'contexts/Network';
import { useLedgerAccounts } from 'contexts/Hardware/Ledger/LedgerAccounts';
import { useVaultHardware } from 'contexts/Hardware/Vault';
import { defaultImportedAccountsContext } from './defaults';
import type { AccountSource, ImportedAccountsContextInterface } from './types';
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
  const {
    networkData: { ss58 },
  } = useNetwork();
  const { addVaultAccount } = useVaultHardware();
  const { addLedgerAccount } = useLedgerAccounts();
  const { extensionAccounts } = useExtensionAccounts();
  const { otherAccounts, addExternalAccount } = useOtherAccounts();
  const allAccounts = extensionAccounts.concat(otherAccounts);

  // Returns an account from the list of all accounts.
  const getAccount = (who: MaybeAddress) =>
    allAccounts.find(({ address }) => address === who) || null;

  // Checks whether an account is read-only.
  const isReadOnlyAccount = (address: MaybeAddress) => {
    const account = getAccount(address) ?? {};
    if (Object.prototype.hasOwnProperty.call(account, 'addedBy')) {
      const { addedBy } = account as ExternalAccount;
      return addedBy === 'user';
    }
    return false;
  };

  // Checks whether an account can sign transactions.
  const accountHasSigner = (address: MaybeAddress) =>
    allAccounts.find(
      (a) => a.address === address && a.source !== 'external'
    ) !== undefined;

  // Checks whether an account needs manual signing. This is the case for Ledger accounts,
  // transactions of which cannot be automatically signed by a provided `signer` as is the case with
  // extensions.
  const requiresManualSign = (address: MaybeAddress) =>
    allAccounts.find(
      (a) => a.address === address && ManualSigners.includes(a.source)
    ) !== undefined;

  // Add an account to the list of all accounts.
  const importAccount = (
    source: AccountSource,
    address: string,
    options?: {
      index?: number;
      addedBy?: 'user' | 'system';
    }
  ) => {
    // Ensure account is formatted correctly.
    const keyring = new Keyring();
    keyring.setSS58Format(ss58);
    const formatted = keyring.addFromAddress(address).address;

    // Check if account is already imported.
    const isImported = allAccounts.find(
      (a: ImportedAccount) => a.address === formatted
    );
    if (isImported) return null;

    // Add account to the list of source accounts.
    let account: ImportedAccount | null = null;
    if (source === 'ledger' && options?.index !== undefined) {
      account = addLedgerAccount(address, options.index);
    } else if (source === 'vault' && options?.index !== undefined) {
      account = addVaultAccount(address, options.index);
    } else if (source === 'external') {
      account = addExternalAccount(address, 'user');
    }

    return account || null;
  };

  return (
    <ImportedAccountsContext.Provider
      value={{
        accounts: allAccounts,
        getAccount,
        importAccount,
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
