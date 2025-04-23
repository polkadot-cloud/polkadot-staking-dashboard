// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FastUnstakeResult } from 'plugin-staking-api/types'
import type { FastUnstakeHead, FastUnstakeQueue } from 'types'

export interface FastUnstakeContextInterface {
  exposed: boolean
  queueDeposit: FastUnstakeQueue
  head: FastUnstakeHead | undefined
  counterForQueue: number | undefined
  fastUnstakeStatus: FastUnstakeResult | null
  setFastUnstakeStatus: (status: FastUnstakeResult | null) => void
}
