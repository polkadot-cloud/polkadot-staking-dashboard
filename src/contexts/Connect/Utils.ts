// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Keyring from '@polkadot/keyring';
import { localStorageOrDefault } from '@polkadot-cloud/utils';
import type { ExternalAccount } from '@polkadot-cloud/react/types';
import type { NetworkName } from 'types';

// gets local `activeAccount` for a network
export const getActiveAccountLocal = (network: NetworkName, ss58: number) => {
  const keyring = new Keyring();
  keyring.setSS58Format(ss58);
  let account = localStorageOrDefault(`${network}_active_account`, null);
  if (account !== null) {
    account = keyring.addFromAddress(account).address;
  }
  return account;
};

// Adds a local external account to local storage.
export const addLocalExternalAccount = (account: ExternalAccount) => {
  localStorage.setItem(
    'external_accounts',
    JSON.stringify(getLocalExternalAccounts().concat(account))
  );
};

// Updates a local external account with the provided `addedBy` property.
export const updateLocalExternalAccount = (entry: ExternalAccount) => {
  localStorage.setItem(
    'external_accounts',
    JSON.stringify(
      getLocalExternalAccounts().map((a) =>
        a.address === entry.address ? entry : a
      )
    )
  );
};

// Gets local external accounts from local storage.
export const getLocalExternalAccounts = (network?: NetworkName) => {
  let localAccounts = localStorageOrDefault(
    'external_accounts',
    [],
    true
  ) as ExternalAccount[];
  if (network)
    localAccounts = localAccounts.filter((l) => l.network === network);
  return localAccounts;
};

// Removes supplied external cccounts from local storage.
export const removeLocalExternalAccounts = (
  network: NetworkName,
  accounts: ExternalAccount[]
) => {
  if (!accounts.length) return;

  const updatedAccounts = getLocalExternalAccounts(network).filter(
    (a) =>
      accounts.find((b) => b.address === a.address && a.network === network) ===
      undefined
  );
  localStorage.setItem('external_accounts', JSON.stringify(updatedAccounts));
};

// Formats an address with the supplied ss58 prefix.
export const formatAccountSs58 = (address: string, ss58: number) => {
  try {
    const keyring = new Keyring();
    keyring.setSS58Format(ss58);
    const formatted = keyring.addFromAddress(address).address;
    if (formatted !== address) return formatted;

    return null;
  } catch (e) {
    return null;
  }
};
