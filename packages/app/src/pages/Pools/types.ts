// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ListFormat } from 'contexts/List/types'
import type { PrevActivePool } from 'types'

export interface PoolAccountProps {
  address: string | null
  pool: PrevActivePool | null
}

export interface PoolsTabsContextInterface {
  setActiveTab: (t: number) => void
  activeTab: number
}

export interface PayoutListContextInterface {
  setListFormat: (v: ListFormat) => void
  listFormat: ListFormat
}
