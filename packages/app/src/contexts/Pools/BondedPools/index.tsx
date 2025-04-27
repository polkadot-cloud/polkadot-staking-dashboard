// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import type { Sync } from '@w3ux/types'
import { setStateWithRef, shuffle } from '@w3ux/utils'
import { getNetworkData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useStaking } from 'contexts/Staking'
import { Syncs } from 'controllers/Syncs'
import type {
  PalletNominationPoolsBondedPoolInner,
  PalletStakingNominations,
} from 'dedot/chaintypes'
import { hexToString } from 'dedot/utils'
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import type {
  AnyJson,
  BondedPool,
  MaybeAddress,
  MaybePool,
  NominationStatus,
  NominationStatuses,
  PoolNominations,
  PoolTab,
} from 'types'
import { useApi } from '../../Api'
import type { BondedPoolsContextState } from './types'

export const [BondedPoolsContext, useBondedPools] =
  createSafeContext<BondedPoolsContextState>()

export const BondedPoolsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const {
    isReady,
    activeEra,
    serviceApi,
    poolsConfig: { lastPoolId },
  } = useApi()
  const createPoolAccounts = useCreatePoolAccounts()
  const { getNominationsStatusFromTargets } = useStaking()
  const { ss58 } = getNetworkData(network)

  // Store bonded pools. Used implicitly in callbacks, ref is also defined
  const [bondedPools, setBondedPools] = useState<BondedPool[]>([])
  const bondedPoolsRef = useRef(bondedPools)

  // Track the sync status of `bondedPools`
  const bondedPoolsSynced = useRef<Sync>('unsynced')

  // Store bonded pools metadata
  const [poolsMetaData, setPoolsMetadata] = useState<Record<number, string>>({})

  // Store bonded pools nominations
  const [poolsNominations, setPoolsNominations] = useState<
    Record<string, PoolNominations>
  >({})

  // Store pool list active tab. Defaults to `Active` tab
  const [poolListActiveTab, setPoolListActiveTab] = useState<PoolTab>('Active')

  // Fetch all bonded pool entries and their metadata
  const fetchBondedPools = async () => {
    if (bondedPoolsSynced.current !== 'unsynced') {
      return
    }
    bondedPoolsSynced.current = 'syncing'

    // Get and format bonded pool entries
    const ids: number[] = []
    const idsMulti: number[] = []
    const bondedPoolEntries = await serviceApi.query.bondedPoolEntries()

    const exposures = shuffle(
      bondedPoolEntries.map(([id, pool]) => {
        ids.push(id)
        idsMulti.push(id)
        return getPoolWithAddresses(id, pool)
      })
    )

    setStateWithRef(exposures, setBondedPools, bondedPoolsRef)

    // Fetch pools metadata
    const metadataQuery = await serviceApi.query.poolMetadataMulti(idsMulti)
    setPoolsMetadata(
      Object.fromEntries(metadataQuery.map((m, i) => [ids[i], hexToString(m)]))
    )

    bondedPoolsSynced.current = 'synced'
    Syncs.dispatch('bonded-pools', 'complete')
  }

  // Fetches pool nominations and updates state
  const fetchPoolsNominations = async () => {
    const ids: number[] = []
    const stashes = bondedPools.map(({ addresses, id }) => {
      ids.push(id)
      return addresses.stash
    })
    const nominationsMulti = await serviceApi.query.nominatorsMulti(stashes)
    const formatted = formatPoolsNominations(nominationsMulti, ids)
    setPoolsNominations(formatted)
  }

  // Format raw pool nominations data
  const formatPoolsNominations = (
    raw: (PalletStakingNominations | undefined)[],
    ids: number[]
  ) =>
    Object.fromEntries(
      raw.map((nominator, i: number) => {
        if (!nominator) {
          return [ids[i], undefined]
        }
        const { targets, ...rest } = nominator
        return [
          String(ids[i]),
          {
            targets: targets?.map((target) => target.address(ss58)) || [],
            ...rest,
          },
        ]
      })
    )

  // Queries a bonded pool and injects ID and addresses to a result
  const queryBondedPool = async (
    id: number
  ): Promise<BondedPool | undefined> => {
    const bondedPool = await serviceApi.query.bondedPool(id)
    if (!bondedPool) {
      return
    }
    return {
      ...bondedPool,
      id,
      addresses: createPoolAccounts(id),
    }
  }

  // Get bonded pool nomination statuses
  const getPoolNominationStatus = (
    nominator: MaybeAddress,
    nomination: MaybeAddress
  ): NominationStatus => {
    const pool = bondedPools.find((p) => p.addresses.stash === nominator)

    if (!pool) {
      return 'waiting'
    }

    // get pool targets from nominations metadata
    const nominations = poolsNominations[pool.id]
    const targets = nominations ? nominations.targets : []
    const target = targets.find((t) => t === nomination)

    if (!target) {
      return 'waiting'
    }

    const nominationStatus = getNominationsStatusFromTargets(nominator, [
      target,
    ])
    return getPoolNominationStatusCode(nominationStatus)
  }

  // Determine bonded pool's current nomination statuse
  const getPoolNominationStatusCode = (statuses: NominationStatuses | null) => {
    let status: NominationStatus = 'waiting'

    if (statuses) {
      for (const childStatus of Object.values(statuses)) {
        if (childStatus === 'active') {
          status = 'active'
          break
        }
        if (childStatus === 'inactive') {
          status = 'inactive'
        }
      }
    }
    return status
  }

  // Helper: to add addresses to pool record
  const getPoolWithAddresses = (
    id: number,
    pool: PalletNominationPoolsBondedPoolInner
  ) => ({
    ...pool,
    id,
    addresses: createPoolAccounts(id),
  })

  const getBondedPool = (poolId: MaybePool) =>
    bondedPools.find((p) => String(p.id) === String(poolId)) ?? null

  // poolSearchFilter Iterates through the supplied list and refers to the meta batch of the list to filter those list items that match the search term. Returns the updated filtered list
  const poolSearchFilter = (list: AnyJson, searchTerm: string) => {
    const filteredList: AnyJson = []

    for (const pool of list) {
      // If pool metadata has not yet been synced, include the pool in results
      if (!Object.values(poolsMetaData).length) {
        filteredList.push(pool)
        continue
      }

      const address = pool?.addresses?.stash ?? ''
      const metadata = poolsMetaData[pool.id] || ''

      if (String(pool.id).includes(searchTerm.toLowerCase())) {
        filteredList.push(pool)
      }
      if (address.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredList.push(pool)
      }
      if (metadata.toLowerCase().includes(searchTerm.toLowerCase())) {
        filteredList.push(pool)
      }
    }
    return filteredList
  }

  const updateBondedPools = (updatedPools: BondedPool[]) => {
    if (!updatedPools) {
      return
    }

    setStateWithRef(
      bondedPools.map(
        (original) =>
          updatedPools.find((updated) => updated.id === original.id) || original
      ),
      setBondedPools,
      bondedPoolsRef
    )
  }

  const updatePoolNominations = (id: number, newTargets: string[]) => {
    const newPoolsNominations = { ...poolsNominations }

    let record = newPoolsNominations?.[id]
    if (record) {
      record.targets = newTargets
    } else {
      record = {
        submittedIn: activeEra.index,
        targets: newTargets,
        suppressed: false,
      }
    }
    setPoolsNominations(newPoolsNominations)
  }

  const removeFromBondedPools = (id: number) => {
    setStateWithRef(
      bondedPools.filter((b) => b.id !== id),
      setBondedPools,
      bondedPoolsRef
    )
  }

  // adds a record to bondedPools
  // currently only used when a new pool is created
  const addToBondedPools = (pool: BondedPool) => {
    if (!pool) {
      return
    }

    const exists = bondedPools.find((b) => b.id === pool.id)
    if (!exists) {
      setStateWithRef(bondedPools.concat(pool), setBondedPools, bondedPoolsRef)
    }
  }

  // Determine roles to replace from roleEdits
  const toReplace = (roleEdits: AnyJson) => {
    const root = roleEdits?.root?.newAddress ?? ''
    const nominator = roleEdits?.nominator?.newAddress ?? ''
    const bouncer = roleEdits?.bouncer?.newAddress ?? ''

    return {
      root,
      nominator,
      bouncer,
    }
  }

  // Replaces the pool roles from roleEdits
  const replacePoolRoles = (poolId: number, roleEdits: AnyJson) => {
    let pool = bondedPools.find((b) => b.id === poolId) || null

    if (!pool) {
      return
    }

    pool = {
      ...pool,
      roles: {
        ...pool.roles,
        ...toReplace(roleEdits),
      },
    }

    const newBondedPools = [
      ...bondedPools.map((b) => (b.id === poolId && pool !== null ? pool : b)),
    ]

    setStateWithRef(newBondedPools, setBondedPools, bondedPoolsRef)
  }

  // Clear existing state for network refresh
  useEffectIgnoreInitial(() => {
    bondedPoolsSynced.current = 'unsynced'
    Syncs.dispatch('bonded-pools', 'syncing')
    setStateWithRef([], setBondedPools, bondedPoolsRef)
    setPoolsMetadata({})
    setPoolsNominations({})
  }, [network])

  // Initial setup for fetching bonded pools
  useEffectIgnoreInitial(() => {
    if (isReady && lastPoolId) {
      fetchBondedPools()
    }
  }, [bondedPools, isReady, lastPoolId])

  // Re-fetch bonded pools nominations when active era changes or when `bondedPools` update
  useEffectIgnoreInitial(() => {
    if (activeEra.index > 0 && bondedPools.length) {
      fetchPoolsNominations()
    }
  }, [activeEra.index, bondedPools.length])

  return (
    <BondedPoolsContext.Provider
      value={{
        queryBondedPool,
        getBondedPool,
        updateBondedPools,
        addToBondedPools,
        removeFromBondedPools,
        getPoolNominationStatus,
        getPoolNominationStatusCode,
        replacePoolRoles,
        poolSearchFilter,
        bondedPools,
        poolsMetaData,
        poolsNominations,
        updatePoolNominations,
        poolListActiveTab,
        setPoolListActiveTab,
      }}
    >
      {children}
    </BondedPoolsContext.Provider>
  )
}
