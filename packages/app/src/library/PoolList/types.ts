// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedPool } from 'types'

export type ListFormat = 'row' | 'col'

export interface PoolListContextProps {
  setListFormat: (v: ListFormat) => void
  listFormat: ListFormat
}
export interface PoolListProps {
  allowMoreCols?: boolean
  allowSearch?: boolean
  pagination?: boolean
  refetchOnListUpdate?: string
  allowListFormat?: boolean
  pools?: BondedPool[]
}
