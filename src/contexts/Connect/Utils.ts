// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Network } from 'types';
import { localStorageOrDefault } from 'Utils';
import Keyring from '@polkadot/keyring';
import { ExternalAccount } from './types';

// removes extension from localExtensions
export const removeFromLocalExtensions = (extensionName: string) => {
  let localExtensions = localStorageOrDefault<string[]>(
    `active_extensions`,
    [],
    true
  );
  if (Array.isArray(localExtensions)) {
    localExtensions = localExtensions.filter(
      (l: string) => l !== extensionName
    );
    localStorage.setItem('active_extensions', JSON.stringify(localExtensions));
  }
};

// Gets local activeAccount
export const getActiveAccountLocal = (network: Network) => {
  const keyring = new Keyring();
  keyring.setSS58Format(network.ss58);

  // get and format active account if present
  let _activeAccount = localStorageOrDefault(
    `${network.name.toLowerCase()}_active_account`,
    null
  );
  if (_activeAccount !== null) {
    _activeAccount = keyring.addFromAddress(_activeAccount).address;
  }
  return _activeAccount;
};

// Formats local external accounts using active network ss58 format.
export const getLocalExternalAccounts = (
  network: Network,
  activeNetworkOnly = false
) => {
  let localExternalAccounts = localStorageOrDefault<Array<ExternalAccount>>(
    `external_accounts`,
    [],
    true
  ) as Array<ExternalAccount>;

  // only fetch external accounts for active network
  if (activeNetworkOnly) {
    localExternalAccounts = localExternalAccounts.filter(
      (l: ExternalAccount) => l.network === network.name
    );
  }
  return localExternalAccounts;
};
