// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountId32 } from 'dedot/codecs'

export interface FastUnstakeConfig {
  head: FastUnstakeHead
  counterForQueue: number
}

export interface FastUnstakeHead {
  stashes: [AccountId32, bigint][]
  checked: number[]
}
