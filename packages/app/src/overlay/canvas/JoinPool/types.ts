// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react'
import type { BondedPool } from 'types'

export interface JoinPoolHeaderProps {
  activeTab: number
  bondedPool: BondedPool
  poolCandidates: BondedPool[]
  metadata: string
  autoSelected: boolean
  setActiveTab: (tab: number) => void
  setSelectedPoolId: Dispatch<SetStateAction<number>>
  providedPoolId: number
}

export interface NominationsProps {
  stash: string
  poolId: number
}

export interface AddressSectionProps {
  address: string
  label: string
  helpKey?: string
}

export interface OverviewSectionProps {
  bondedPool: BondedPool
}
