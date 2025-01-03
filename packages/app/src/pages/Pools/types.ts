// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ListFormat } from 'library/PoolList/types'
import type { ActivePool } from 'types'

export interface PoolAccountProps {
  address: string | null
  pool: ActivePool | null
}

export interface PoolsTabsContextInterface {
  setActiveTab: (t: number) => void
  activeTab: number
}

export interface PayoutListContextInterface {
  setListFormat: (v: ListFormat) => void
  listFormat: ListFormat
}
