// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
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

  // Get the provided pool id from options
  // Check both direct id and fromInvite flag
  const providedPoolId = options?.id || null
  const fromInvite = options?.fromInvite || false

  // Whether performance data is ready
  const performanceDataReady = !!providedPoolId || poolCandidates.length > 0

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState<number>(0)

  // Store any identity data for pool roles
  const [roleIdentities, setRoleIdentities] = useState<RoleIdentities>({
    identities: {},
    supers: {},
  })

  // The selected bonded pool id
  const [selectedPoolId, setSelectedPoolId] = useState<number>(0)

  // Keep track of whether we've set the initial pool
  const [initialPoolSet, setInitialPoolSet] = useState(false)

  // Gets pool candidates for joining pool
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

  // Filtered and shuffled pool candidates
  const shuffledCandidates: BondedPool[] = useMemo(
    () =>
      poolCandidates
        .map((poolId) =>
          bondedPools.find(
            (bondedPool) => Number(bondedPool.id) === Number(poolId)
          )
        )
        .filter((entry) => entry !== undefined) as BondedPool[],
    [poolCandidates, bondedPools]
  )

  // Effect to set the pool ID once data is available
  useEffect(() => {
    if (bondedPools.length > 0 && !initialPoolSet) {
      console.log(
        'Setting up pool, provided ID:',
        providedPoolId,
        'from invite:',
        fromInvite
      )

      const selectRandomPool = () => {
        const randomId =
          bondedPools[Math.floor(Math.random() * bondedPools.length)]?.id || 0
        console.log('Using random pool:', randomId)
        setSelectedPoolId(Number(randomId))
        setInitialPoolSet(true)
      }

      if (providedPoolId) {
        // Find the pool in bonded pools
        const pool = bondedPools.find(
          (p) => Number(p.id) === Number(providedPoolId)
        )
        if (pool) {
          console.log('Setting provided pool ID:', Number(providedPoolId))
          setSelectedPoolId(Number(providedPoolId))
          setInitialPoolSet(true)
        } else {
          selectRandomPool()
        }
      } else if (!initialPoolSet) {
        selectRandomPool()
      }
    }
  }, [bondedPools, providedPoolId, initialPoolSet, fromInvite])

  // Fetch pool candidates on initial load
  useEffect(() => {
    getPoolCandidates().then((candidates) => {
      console.log('Got pool candidates:', candidates)
      setPoolCandidates(candidates)
    })
  }, [])

  // The bonded pool to display
  const bondedPool = useMemo(
    () => bondedPools.find(({ id }) => Number(id) === Number(selectedPoolId)),
    [selectedPoolId, bondedPools]
  )

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
            autoSelected={!fromInvite}
            poolCandidates={shuffledCandidates}
            providedPoolId={fromInvite ? providedPoolId : null}
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
