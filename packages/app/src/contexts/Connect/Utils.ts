// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { formatAccountSs58, localStorageOrDefault } from '@w3ux/utils'
import type { ActiveAccount, ActiveProxy, NetworkId } from 'types'

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
  } catch (e) {
    localStorage.removeItem(`${network}_active_account`)
    return null
  }
}

// Gets an active proxy from local storage for a network
export const getActiveProxyLocal = (
  network: NetworkId,
  ss58: number
): ActiveProxy => {
  try {
    const account = localStorageOrDefault(
      `${network}_active_proxy`,
      null
    ) as ActiveProxy

    if (account && account?.address) {
      const formatted = formatAccountSs58(account.address, ss58)
      if (formatted) {
        account.address = formatted
        return account
      }
    }
    return null
  } catch (e) {
    localStorage.removeItem(`${network}_active_proxy`)
    return null
  }
}
