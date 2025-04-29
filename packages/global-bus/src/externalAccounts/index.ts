// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ExternalAccountsKey } from 'consts'
import type { ExternalAccount, NetworkId } from 'types'
import { _externalAccounts } from './private'

export const externalAccounts$ = _externalAccounts.asObservable()

// Check whether an external account exists
export const externalAccountExists = (network: NetworkId, address: string) =>
  _externalAccounts
    .getValue()
    .find((l) => l.address === address && l.network === network)

// Adds an external account to state
export const addExternalAccount = (
  network: NetworkId,
  account: ExternalAccount,
  noLocal: boolean = false
) => {
  const newAccounts = [..._externalAccounts.getValue()]
    .filter((a) => a.address !== account.address && a.network !== network)
    .concat(account)

  if (!noLocal) {
    localStorage.setItem(ExternalAccountsKey, JSON.stringify(newAccounts))
  }
  _externalAccounts.next(newAccounts)
}

// Removes external accounts from state
export const removeExternalAccounts = (
  network: NetworkId,
  accounts: ExternalAccount[]
) => {
  const newAccounts = [..._externalAccounts.getValue()].filter(
    (a) =>
      accounts.find((b) => b.address === a.address && a.network === network) ===
      undefined
  )

  localStorage.setItem(ExternalAccountsKey, JSON.stringify(newAccounts))
  _externalAccounts.next(newAccounts)
}
