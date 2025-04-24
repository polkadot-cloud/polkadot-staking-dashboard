// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountBalance } from 'types'

export const defaultAccountBalance: AccountBalance = {
  nonce: 0,
  balance: {
    free: 0n,
    reserved: 0n,
    frozen: 0n,
  },
  locks: [],
  maxLock: 0n,
}
