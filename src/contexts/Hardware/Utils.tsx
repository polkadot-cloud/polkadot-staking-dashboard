// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { localStorageOrDefault } from '@polkadotcloud/utils';
import { LedgerApps } from 'config/ledger';
import type { LedgerAccount } from 'contexts/Connect/types';
import type { LedgerAddress, LedgerApp } from './types';

// Gets ledger app from local storage, fallback to first entry.
export const getLedgerApp = (network: string) => {
  return (
    LedgerApps.find((a: LedgerApp) => a.network === network) || LedgerApps[0]
  );
};

// Gets saved ledger addresses from local storage.
export const getLocalLedgerAddresses = (network?: string) => {
  const localAddresses = localStorageOrDefault(
    'ledger_addresses',
    [],
    true
  ) as Array<LedgerAddress>;

  if (network) {
    return localAddresses.filter((a: LedgerAddress) => a.network === network);
  }
  return localAddresses;
};

// Gets imported Ledger accounts from local storage.
export const getLocalLedgerAccounts = (network?: string) => {
  const localAddresses = localStorageOrDefault(
    'ledger_accounts',
    [],
    true
  ) as Array<LedgerAccount>;

  if (network) {
    return localAddresses.filter((a: LedgerAccount) => a.network === network);
  }
  return localAddresses;
};
