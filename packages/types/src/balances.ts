// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface AccountBalance {
  synced: boolean
  nonce: number
  balance: {
    free: bigint
    reserved: bigint
    frozen: bigint
  }
}
