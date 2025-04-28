// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { MaybeAddress } from 'types'

export interface TransferOptionsContextInterface {
  getTransferOptions: (address: MaybeAddress) => TransferOptions
  getStakedBalance: (address: MaybeAddress) => BigNumber
  setFeeReserveBalance: (reserve: bigint) => void
  feeReserve: bigint
  getFeeReserve: (address: MaybeAddress) => bigint
}

export interface TransferOptions {
  freeBalance: bigint
  transferrableBalance: BigNumber
  balanceTxFees: BigNumber
  edReserved: bigint
  nominate: {
    active: BigNumber
    totalUnlocking: BigNumber
    totalUnlocked: BigNumber
    totalPossibleBond: BigNumber
    totalAdditionalBond: BigNumber
    totalUnlockChunks: number
  }
  pool: {
    active: BigNumber
    totalUnlocking: BigNumber
    totalUnlocked: BigNumber
    totalPossibleBond: BigNumber
    totalUnlockChunks: number
  }
}
