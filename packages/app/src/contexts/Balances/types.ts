// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { PoolMembership } from 'contexts/Pools/types'
import type { PayeeConfig } from 'contexts/Setup/types'
import type { MaybeAddress, Nominations, Targets } from 'types'

export interface BalancesContextInterface {
  activeBalances: ActiveBalancesState
  getNonce: (address: MaybeAddress) => number
  getLocks: (address: MaybeAddress) => BalanceLocks
  getBalance: (address: MaybeAddress) => Balance
  getLedger: (source: ActiveLedgerSource) => Ledger
  getPayee: (address: MaybeAddress) => PayeeConfig
  getPoolMembership: (address: MaybeAddress) => PoolMembership | null
  getNominations: (address: MaybeAddress) => Targets
  getEdReserved: (
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ) => BigNumber
}

export type ActiveBalancesState = Record<string, ActiveBalance>

export interface ActiveBalance {
  ledger: Ledger | undefined
  balances: Balances
  payee: PayeeConfig | undefined
  poolMembership: PoolMembership | undefined
  nominations: Nominations
}

export interface Balances {
  nonce: number
  balance: Balance
  locks: BalanceLock[]
}

export interface BalanceLocks {
  locks: BalanceLock[]
  maxLock: BigNumber
}

export interface Balance {
  free: BigNumber
  reserved: BigNumber
  frozen: BigNumber
}

export interface UnlockChunkRaw {
  era: string
  value: string
}
export interface UnlockChunk {
  era: number
  value: BigNumber
}

export interface BalanceLock {
  id: string
  amount: BigNumber
  reasons: string
}

export interface Ledger {
  stash: string | null
  active: BigNumber
  total: BigNumber
  unlocking: UnlockChunk[]
}

export type ActiveLedgerSource = {
  [key in 'stash' | 'key']?: MaybeAddress
}
