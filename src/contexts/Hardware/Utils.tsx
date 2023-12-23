// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@polkadot-cloud/utils';
import { LedgerApps } from 'config/ledger';
import type { MaybeString } from 'types';
import type { LedgerAccount, VaultAccount } from '@polkadot-cloud/react/types';
import type { LedgerAddress } from './Ledger/types';

// Ledger error keyed by type of error.
const LedgerErrorsByType = {
  timeout: ['Error: Timeout'],
  methodNotSupported: ['Error: Method not supported'],
  nestingNotSupported: ['Error: Call nesting not supported'],
  outsideActiveChannel: ['Error: TransportError: Invalid channel'],
  deviceNotConnected: ['TransportOpenUserCancelled'],
  deviceBusy: ['Error: Ledger Device is busy', 'InvalidStateError'],
  deviceLocked: ['Error: LockedDeviceError'],
  transactionRejected: ['Error: Transaction rejected'],
  appNotOpen: ['Error: Unknown Status Code: 28161'],
};

// Determine type of error returned by Ledger.
export const getLedgerErrorType = (err: string) => {
  let errorType = null;
  Object.entries(LedgerErrorsByType).every(([type, errors]) => {
    let found = false;
    errors.every((e) => {
      if (err.startsWith(e)) {
        errorType = type;
        found = true;
        return false;
      }
      return true;
    });
    if (found) {
      return false;
    }
    return true;
  });
  return errorType || 'misc';
};

// Gets ledger app from local storage, fallback to first entry.
export const getLedgerApp = (network: string) =>
  LedgerApps.find((a) => a.network === network) || LedgerApps[0];

// Gets saved ledger addresses from local storage.
export const getLocalLedgerAddresses = (network?: string) => {
  const localAddresses = localStorageOrDefault(
    'ledger_addresses',
    [],
    true
  ) as LedgerAddress[];

  return network
    ? localAddresses.filter((a) => a.network === network)
    : localAddresses;
};

// Gets imported Ledger accounts from local storage.
export const getLocalLedgerAccounts = (network?: string): LedgerAccount[] => {
  const localAddresses = localStorageOrDefault(
    'ledger_accounts',
    [],
    true
  ) as LedgerAccount[];

  return network
    ? localAddresses.filter((a) => a.network === network)
    : localAddresses;
};

// Renames a record from local ledger addresses.
export const renameLocalLedgerAddress = (
  address: string,
  name: string,
  network: string
) => {
  const localLedger = (
    localStorageOrDefault('ledger_addresses', [], true) as LedgerAddress[]
  )?.map((i) =>
    !(i.address === address && i.network === network)
      ? i
      : {
          ...i,
          name,
        }
  );
  if (localLedger) {
    localStorage.setItem('ledger_addresses', JSON.stringify(localLedger));
  }
};

// Gets imported Vault accounts from local storage.
export const getLocalVaultAccounts = (network?: string) => {
  const localAddresses = localStorageOrDefault(
    'polkadot_vault_accounts',
    [],
    true
  ) as VaultAccount[];

  return network
    ? localAddresses.filter((a) => a.network === network)
    : localAddresses;
};

// Gets whether an address is a local network address.
export const isLocalNetworkAddress = (
  chain: string,
  a: { address: MaybeString; network: string },
  address: string
) => a.address === address && a.network === chain;
