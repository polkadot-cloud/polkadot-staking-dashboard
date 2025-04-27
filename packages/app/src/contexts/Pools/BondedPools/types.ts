// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyFilter } from 'library/Filter/types'
import type { Dispatch, SetStateAction } from 'react'
import type {
  AnyJson,
  BondedPool,
  MaybeAddress,
  NominationStatus,
  NominationStatuses,
  PoolNominations,
  PoolTab,
} from 'types'

export interface BondedPoolsContextState {
  queryBondedPool: (poolId: number) => Promise<BondedPool | undefined>
  getBondedPool: (poolId: number) => BondedPool | null
  updateBondedPools: (bondedPools: BondedPool[]) => void
  addToBondedPools: (bondedPool: BondedPool) => void
  removeFromBondedPools: (poolId: number) => void
  getPoolNominationStatus: (
    nominator: MaybeAddress,
    address: MaybeAddress
  ) => NominationStatus
  getPoolNominationStatusCode: (statuses: NominationStatuses | null) => string
  replacePoolRoles: (poolId: number, roleEdits: AnyJson) => void
  poolSearchFilter: (filteredPools: AnyFilter, searchTerm: string) => AnyJson[]
  bondedPools: BondedPool[]
  poolsMetaData: Record<number, string>
  poolsNominations: Record<number, PoolNominations>
  updatePoolNominations: (id: number, nominations: string[]) => void
  poolListActiveTab: PoolTab
  setPoolListActiveTab: Dispatch<SetStateAction<PoolTab>>
}
