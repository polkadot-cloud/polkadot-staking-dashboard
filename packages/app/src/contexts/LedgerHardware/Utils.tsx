// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
