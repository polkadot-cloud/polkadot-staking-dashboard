// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExternalAccount } from '@w3ux/types'
import { localStorageOrDefault } from '@w3ux/utils'
import type { NetworkId } from 'common-types'

// Check whether an external account exists in local storage
export const externalAccountExistsLocal = (
  address: string,
  network: NetworkId
) =>
  getLocalExternalAccounts().find(
    (l) => l.address === address && l.network === network
  )

// Gets local external accounts from local storage. Ensure that only `user` accounts are returned
export const getLocalExternalAccounts = (network?: NetworkId) => {
  let localAccounts = localStorageOrDefault(
    'external_accounts',
    [],
    true
  ) as ExternalAccount[]
  if (network) {
    localAccounts = localAccounts.filter(
      (l) => l.network === network && l.addedBy !== 'system'
    )
  }
  return localAccounts
}

// Adds a local external account to local storage
export const addLocalExternalAccount = (account: ExternalAccount) => {
  localStorage.setItem(
    'external_accounts',
    JSON.stringify(getLocalExternalAccounts().concat(account))
  )
}

// Updates a local external account with the provided `addedBy` property
export const updateLocalExternalAccount = (entry: ExternalAccount) => {
  localStorage.setItem(
    'external_accounts',
    JSON.stringify(
      getLocalExternalAccounts().map((a) =>
        a.address === entry.address ? entry : a
      )
    )
  )
}

// Removes supplied external cccounts from local storage
export const removeLocalExternalAccounts = (
  network: NetworkId,
  accounts: ExternalAccount[]
) => {
  if (!accounts.length) {
    return
  }

  const updatedAccounts = getLocalExternalAccounts(network).filter(
    (a) =>
      accounts.find((b) => b.address === a.address && a.network === network) ===
      undefined
  )
  localStorage.setItem('external_accounts', JSON.stringify(updatedAccounts))
}
