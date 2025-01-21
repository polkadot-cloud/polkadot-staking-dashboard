// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { fetchPoolCandidates } from 'plugin-staking-api'
import { useEffect, useMemo, useState } from 'react'
import type { BondedPool } from 'types'
import { Main } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'
import { Header } from './Header'
import { Nominations } from './Nominations'
import { Overview } from './Overview'
import { Preloader } from './Preloader'

export const JoinPool = () => {
  const {
    config: { options },
  } = useOverlay().canvas
  const { network } = useNetwork()
  const { poolsMetaData, bondedPools } = useBondedPools()

  // Store latest pool candidates
  const [poolCandidates, setPoolCandidates] = useState<number[]>([])

  // Get the provided pool id and performance batch key from options, if available.
  const providedPool = options?.providedPool
  const providedPoolId = providedPool?.id || null

  // Whether performance data is ready
  const performanceDataReady = !!providedPoolId || poolCandidates.length > 0

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState<number>(0)

  // Gets pool candidates for joining pool
  const getPoolCandidates = async () => {
    const result = await fetchPoolCandidates(network)
    return result?.poolCandidates || []
  }

  // Filter bonded pools to only those that are open and that have active daily rewards for the last
  // `MaxEraRewardPointsEras` eras. The second filter checks if the pool is in `eraStakers` for the
  // active era.
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

  const initialSelectedPoolId = useMemo(
    () =>
      providedPoolId ||
      shuffledCandidates[(shuffledCandidates.length * Math.random()) << 0]
        ?.id ||
      0,
    []
  )

  // The selected bonded pool id. Assigns a random id if one is not provided.
  const [selectedPoolId, setSelectedPoolId] = useState<number>(
    initialSelectedPoolId
  )

  // The bonded pool to display. Use the provided `poolId`, or assign a random eligible filtered
  // pool otherwise. Re-fetches when the selected pool count is incremented.
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
            autoSelected={!!providedPoolId}
            poolCandidates={shuffledCandidates}
            providedPoolId={providedPoolId}
          />
          {activeTab === 0 && <Overview bondedPool={bondedPool} />}
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
