// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FastUnstakeHead } from 'api/subscribe/fastUnstakeConfig/types'
import type BigNumber from 'bignumber.js'
import type { FastUnstakeResult } from 'plugin-staking-api/types'

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
