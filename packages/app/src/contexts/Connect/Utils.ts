// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatAccountSs58, localStorageOrDefault } from '@w3ux/utils'
import type { ActiveAccount, NetworkId } from 'types'

// Gets an active account from local storage for a network
export const getActiveAccountLocal = (
  network: NetworkId,
  ss58: number
): ActiveAccount => {
  try {
    const account = localStorageOrDefault(
      `${network}_active_account`,
      null,
      true
    ) as ActiveAccount

    if (account) {
      const formatted = formatAccountSs58(account.address, ss58)
      if (formatted) {
        account.address = formatted
        return account
      }
    }
    return null
  } catch {
    localStorage.removeItem(`${network}_active_account`)
    return null
  }
}
