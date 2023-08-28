// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import Keyring from '@polkadot/keyring';
import { localStorageOrDefault } from '@polkadot-cloud/utils';
import type { ExtensionAccount } from 'contexts/Extensions/types';
import type { Network, NetworkName } from 'types';
import type { ExternalAccount } from './types';

// extension utils

export const manualSigners = ['ledger', 'vault'];

// adds an extension to local `active_extensions`
export const addToLocalExtensions = (id: string) => {
  const localExtensions = localStorageOrDefault<string[]>(
    `active_extensions`,
    [],
    true
  );
  if (Array.isArray(localExtensions)) {
    if (!localExtensions.includes(id)) {
      localExtensions.push(id);
      localStorage.setItem(
        'active_extensions',
        JSON.stringify(localExtensions)
      );
    }
  }
};

// removes extension from local `active_extensions`
export const removeFromLocalExtensions = (id: string) => {
  let localExtensions = localStorageOrDefault<string[]>(
    `active_extensions`,
    [],
    true
  );
  if (Array.isArray(localExtensions)) {
    localExtensions = localExtensions.filter((l: string) => l !== id);
    localStorage.setItem('active_extensions', JSON.stringify(localExtensions));
  }
};

// check if an extension exists in local `active_extensions`.
export const extensionIsLocal = (id: string) => {
  // connect if extension has been connected to previously
  const localExtensions = localStorageOrDefault<string[]>(
    `active_extensions`,
    [],
    true
  );
  let foundExtensionLocally = false;
  if (Array.isArray(localExtensions)) {
    foundExtensionLocally = localExtensions.find((l) => l === id) !== undefined;
  }
  return foundExtensionLocally;
};

// account utils

// gets local `activeAccount` for a network
export const getActiveAccountLocal = (network: Network) => {
  const keyring = new Keyring();
  keyring.setSS58Format(network.ss58);
  let account = localStorageOrDefault(`${network.name}_active_account`, null);
  if (account !== null) {
    account = keyring.addFromAddress(account).address;
  }
  return account;
};

// gets local external accounts, formatting their addresses
// using active network ss58 format.
export const getLocalExternalAccounts = (network?: NetworkName) => {
  let localAccounts = localStorageOrDefault<ExternalAccount[]>(
    'external_accounts',
    [],
    true
  ) as ExternalAccount[];
  if (network) {
    localAccounts = localAccounts.filter((l) => l.network === network);
  }
  return localAccounts;
};

// gets accounts that exist in local `external_accounts`
export const getInExternalAccounts = (
  accounts: ExtensionAccount[],
  network: NetworkName
) => {
  const localExternalAccounts = getLocalExternalAccounts(network);

  return (
    localExternalAccounts.filter(
      (a) => (accounts || []).find((b) => b.address === a.address) !== undefined
    ) || []
  );
};

// removes supplied accounts from local `external_accounts`.
export const removeLocalExternalAccounts = (
  network: Network,
  accounts: ExternalAccount[]
) => {
  let localExternalAccounts = getLocalExternalAccounts(network.name);
  localExternalAccounts = localExternalAccounts.filter(
    (a) =>
      accounts.find(
        (b) => b.address === a.address && a.network === network.name
      ) === undefined
  );
  localStorage.setItem(
    'external_accounts',
    JSON.stringify(localExternalAccounts)
  );
};
