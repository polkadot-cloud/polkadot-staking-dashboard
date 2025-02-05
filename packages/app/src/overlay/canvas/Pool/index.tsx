// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, SystemChainId } from 'common-types'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { Apis } from 'controllers/Apis'
import { Identities } from 'controllers/Identities'
import { fetchPoolCandidates } from 'plugin-staking-api'
import { useEffect, useMemo, useState } from 'react'
import type { BondedPool } from 'types'
import { Main } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'
import { Header } from './Header'
import { Nominations } from './Nominations'
import { Overview } from './Overview'
import { Preloader } from './Preloader'
import type { RoleIdentities } from './types'

export const Pool = () => {
  const {
    config: { options },
  } = useOverlay().canvas
  const { network } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { poolsMetaData, bondedPools } = useBondedPools()

  // Store latest pool candidates
  const [poolCandidates, setPoolCandidates] = useState<number[]>([])

  // Get the provided pool id and performance batch key from options, if available
  const providedPool = options?.providedPool
  const providedPoolId = providedPool?.id || null

  // Whether performance data is ready
  const performanceDataReady = !!providedPoolId || poolCandidates.length > 0

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState<number>(0)

  // Store any identity data for pool roles
  const [roleIdentities, setRoleIdentities] = useState<RoleIdentities>({
    identities: {},
    supers: {},
  })

  // Gets pool candidates for joining pool. If Staking API is disabled, fall back to subset of open
  // pools
  const getPoolCandidates = async () => {
    if (pluginEnabled('staking_api')) {
      const result = await fetchPoolCandidates(network)
      return result?.poolCandidates || []
    } else {
      return bondedPools
        .filter(({ state }) => state === 'Open')
        .map(({ id }) => Number(id))
        .sort(() => Math.random() - 0.5)
    }
  }

  const shuffledCandidates: BondedPool[] = useMemo(
    () =>
      poolCandidates
        .map((poolId) =>
          bondedPools.find(
            (bondedPool) => Number(bondedPool.id) === Number(poolId)
          )
        )
        .filter((entry) => entry !== undefined),
    [poolCandidates]
  )

  // The selected bonded pool id
  const [selectedPoolId, setSelectedPoolId] = useState<number>(0)

  // Keep track of whether we've set the initial pool
  const [initialPoolSet, setInitialPoolSet] = useState(false)

  // Effect to set the pool ID once data is available
  useEffect(() => {
    if (bondedPools.length > 0 && !initialPoolSet) {
      // If a forced pool ID is provided, use it directly
      if (options?.forcePoolId) {
        console.log('Forcing pool selection:', options.forcePoolId)
        setSelectedPoolId(Number(options.forcePoolId))
        setInitialPoolSet(true)
        return
      }

      const providedId = options?.id
      const isInvite = options?.fromInvite
      console.log('Pool selection attempt:', { providedId, isInvite })

      if (isInvite && providedId) {
        const pool = bondedPools.find(
          (p) => String(p.id) === String(providedId)
        )
        if (pool) {
          console.log('Setting invited pool ID to:', Number(providedId))
          setSelectedPoolId(Number(providedId))
          setInitialPoolSet(true)
        }
      }
    }
  }, [
    bondedPools,
    options?.forcePoolId,
    options?.id,
    options?.fromInvite,
    initialPoolSet,
  ])

  // Also log in the random selection effect
  useEffect(() => {
    if (!providedPoolId) {
      getPoolCandidates().then((candidates) => {
        console.log('Got pool candidates:', candidates)
        setPoolCandidates(candidates)
      })
    }
  }, [])

  // The bonded pool to display. Use the provided `poolId`, or assign a random eligible filtered
  // pool otherwise. Re-fetches when the selected pool count is incremented
  const bondedPool = useMemo(
    () => bondedPools.find(({ id }) => Number(id) === Number(selectedPoolId)),
    [selectedPoolId]
  )

  // Fetch pool candidates if provided pool is not available
  useEffect(() => {
    if (!providedPoolId) {
      getPoolCandidates().then((candidates) => {
        setPoolCandidates(candidates)
        setSelectedPoolId(candidates[(candidates.length * Math.random()) << 0])
      })
    }
  }, [])

  // Fetch pool role identities when bonded pool changes
  const handleRoleIdentities = async (addresses: string[]) => {
    const peopleApiId: ChainId = `people-${network}`
    const peopleApiClient = Apis.getClient(`people-${network}` as SystemChainId)
    if (peopleApiClient) {
      const { identities, supers } = await Identities.fetch(peopleApiId, [
        ...addresses,
      ])
      setRoleIdentities({ identities, supers })
    }
  }

  useEffect(() => {
    if (bondedPool) {
      handleRoleIdentities([...new Set(Object.values(bondedPool.roles))])
    }
  }, [bondedPool])

  return (
    <Main>
      {(!providedPoolId && !performanceDataReady) || !bondedPool ? (
        <Preloader />
      ) : (
        <>
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSelectedPoolId={setSelectedPoolId}
            bondedPool={bondedPool}
            metadata={poolsMetaData[selectedPoolId]}
            autoSelected={!options?.fromInvite}
            poolCandidates={shuffledCandidates}
            providedPoolId={options?.fromInvite ? options?.id : null}
          />
          {activeTab === 0 && (
            <Overview bondedPool={bondedPool} roleIdentities={roleIdentities} />
          )}
          {activeTab === 1 && (
            <Nominations
              poolId={bondedPool.id}
              stash={bondedPool.addresses.stash}
            />
          )}
        </>
      )}
    </Main>
  )
}
