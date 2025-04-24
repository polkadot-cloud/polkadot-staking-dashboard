// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface AccountBalance {
  nonce: number
  balance: {
    free: bigint
    reserved: bigint
    frozen: bigint
  }
  locks: {
    id: string
    amount: bigint
  }[]
  maxLock: bigint
}
