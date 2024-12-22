// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import { LedgerChains } from 'config/ledger'
import type { LedgerAddress } from './types'

// Ledger error keyed by type of error
const LedgerErrorsByType = {
  timeout: ['Error: Timeout'],
  methodNotSupported: ['Error: Method not supported'],
  nestingNotSupported: ['Error: Call nesting not supported'],
  outsideActiveChannel: ['Error: TransportError: Invalid channel'],
  deviceNotConnected: ['TransportOpenUserCancelled'],
  deviceBusy: ['Error: Ledger Device is busy', 'InvalidStateError'],
  deviceLocked: ['Error: LockedDeviceError'],
  transactionRejected: ['Error: Transaction rejected'],
  txVersionNotSupported: ['Error: Txn version not supported'],
  appNotOpen: ['Error: Unknown Status Code: 28161'],
}

// Determine type of error returned by Ledger
export const getLedgerErrorType = (err: string) => {
  let errorType = null
  Object.entries(LedgerErrorsByType).every(([type, errors]) => {
    let found = false
    errors.every((e) => {
      if (err.startsWith(e)) {
        errorType = type
        found = true
        return false
      }
      return true
    })
    if (found) {
      return false
    }
    return true
  })
  return errorType || 'misc'
}

// Gets ledger app from local storage, fallback to first entry
export const getLedgerApp = (network: string) =>
  LedgerChains.find((a) => a.network === network) || LedgerChains[0]

// Gets saved ledger addresses from local storage
export const getLocalLedgerAddresses = (network?: string) => {
  const localAddresses = localStorageOrDefault(
    'ledger_addresses',
    [],
    true
  ) as LedgerAddress[]

  return network
    ? localAddresses.filter((a) => a.network === network)
    : localAddresses
}
