// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { FastUnstakeResult } from 'plugin-staking-api/types'
import type { FastUnstakeHead } from 'types'

export interface FastUnstakeContextInterface {
  exposed: boolean
  queueDeposit: FastUnstakeQueueDeposit | undefined
  head: FastUnstakeHead | undefined
  counterForQueue: number | undefined
  fastUnstakeStatus: FastUnstakeResult | null
  setFastUnstakeStatus: (status: FastUnstakeResult | null) => void
}

export interface FastUnstakeQueueDeposit {
  address: string
  deposit: BigNumber
}

export interface FastUnstakeQueueResult {
  address: string
  deposit: bigint
}
