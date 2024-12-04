// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'types'

export interface JoinPoolsContextInterface {
  poolsForJoin: BondedPool[]
  startJoinPoolFetch: () => void
}
