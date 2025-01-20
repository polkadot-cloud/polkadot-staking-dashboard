// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxEraRewardPointsEras } from 'consts'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useJoinPools } from 'contexts/Pools/JoinPools'
import { usePoolPerformance } from 'contexts/Pools/PoolPerformance'
import { useStaking } from 'contexts/Staking'
import { useEffect, useMemo, useState } from 'react'
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
  const { eraStakers } = useStaking()
  const { poolsForJoin } = useJoinPools()
  const { poolsMetaData, bondedPools } = useBondedPools()
  const { getPoolRewardPoints, getPoolPerformanceTask } = usePoolPerformance()

  // Get the provided pool id and performance batch key from options, if available.
  const providedPool = options?.providedPool
  const providedPoolId = providedPool?.id || null
  const performanceKey =
    providedPoolId && providedPool?.performanceBatchKey
      ? providedPool?.performanceBatchKey
      : 'pool_join'

  // Get the pool performance task to determine if performance data is ready
  const poolJoinPerformanceTask = getPoolPerformanceTask(performanceKey)

  // Whether performance data is ready. Data is already ready (Staking API) if providedPoolId is not
  // null. Otherwise, wait for the performance task to sync
  const performanceDataReady =
    providedPoolId || poolJoinPerformanceTask.status === 'synced'

  // Get performance data: Assumed to be fetched now.
  const poolRewardPoints = getPoolRewardPoints(performanceKey)

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState<number>(0)

  // Filter bonded pools to only those that are open and that have active daily rewards for the last
  // `MaxEraRewardPointsEras` eras. The second filter checks if the pool is in `eraStakers` for the
  // active era.
  const filteredBondedPools = useMemo(
    () =>
      poolsForJoin
        .filter((pool) => {
          // Fetch reward point data for the pool.
          const rawEraRewardPoints =
            poolRewardPoints[pool.addresses.stash] || {}
          const rewardPoints = Object.values(rawEraRewardPoints)

          // Ensure pool has been active for every era in performance data.
          const activeDaily =
            rewardPoints.every((points) => Number(points) > 0) &&
            rewardPoints.length === MaxEraRewardPointsEras

          return activeDaily
        })
        // Ensure the pool is currently in the active set of backers.
        .filter((pool) =>
          eraStakers.stakers.find((staker) =>
            staker.others.find(({ who }) => who !== pool.addresses.stash)
          )
        ),
    [poolsForJoin, poolRewardPoints, performanceDataReady]
  )

  const initialSelectedPoolId = useMemo(
    () =>
      providedPoolId ||
      filteredBondedPools[(filteredBondedPools.length * Math.random()) << 0]
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
    () => bondedPools.find(({ id }) => id === selectedPoolId),
    [selectedPoolId]
  )

  // If syncing completes within the canvas, assign a selected pool.
  useEffect(() => {
    if (performanceDataReady && selectedPoolId === 0) {
      setSelectedPoolId(
        filteredBondedPools[(filteredBondedPools.length * Math.random()) << 0]
          ?.id || 0
      )
    }
  }, [performanceDataReady])

  return (
    <Main>
      {(!providedPoolId && !performanceDataReady) || !bondedPool ? (
        <Preloader performanceKey={performanceKey} />
      ) : (
        <>
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSelectedPoolId={setSelectedPoolId}
            bondedPool={bondedPool}
            metadata={poolsMetaData[selectedPoolId]}
            autoSelected={!!providedPoolId}
            filteredBondedPools={filteredBondedPools}
            providedPoolId={providedPoolId}
          />
          {activeTab === 0 && (
            <Overview bondedPool={bondedPool} performanceKey={performanceKey} />
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
