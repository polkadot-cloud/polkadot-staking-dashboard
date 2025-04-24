// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react'
import type { BondedPool, IdentityOf, SuperIdentity } from 'types'

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
  identities: Record<string, IdentityOf>
  supers: Record<string, SuperIdentity>
}
