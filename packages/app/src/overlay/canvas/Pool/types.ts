// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types'
import type { Dispatch, SetStateAction } from 'react'
import type { BondedPool } from 'types'

export interface HeaderProps {
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

export interface OverviewSectionProps {
  bondedPool: BondedPool
  roleIdentities: RoleIdentities
}

export type RoleIdentities = {
  identities: AnyJson
  supers: AnyJson
}
