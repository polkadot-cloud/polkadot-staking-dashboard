// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FastUnstakeHead } from 'api/subscribe/fastUnstakeConfig/types'
import type BigNumber from 'bignumber.js'
import type { FastUnstakeStatus } from 'plugin-staking-api/types'

export interface FastUnstakeContextInterface {
  checking: boolean
  isExposed: boolean | null
  queueDeposit: FastUnstakeQueueDeposit | undefined
  head: FastUnstakeHead | undefined
  counterForQueue: number | undefined
  setFastUnstakeStatus: (status: FastUnstakeStatus | null) => void
  lastExposed: bigint | null
}

export interface FastUnstakeQueueDeposit {
  address: string
  deposit: BigNumber
}

export interface FastUnstakeQueueResult {
  address: string
  deposit: bigint
}
