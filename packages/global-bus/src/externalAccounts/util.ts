// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExternalAccount } from '@w3ux/types'
import { localStorageOrDefault } from '@w3ux/utils'
import { ExternalAccountsKey } from 'consts'
import type { NetworkId } from 'types'

// Gets existing external accounts from local storage. Ensures that no system-added accounts are
// returned
export const getInitialExternalAccounts = (_?: string, network?: NetworkId) => {
  let localAccounts = localStorageOrDefault(
    ExternalAccountsKey,
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
