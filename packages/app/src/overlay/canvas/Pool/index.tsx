// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { fetchPoolCandidates } from 'plugin-staking-api'
import { useEffect, useMemo, useState } from 'react'
import type { BondedPool } from 'types'
import { Main } from 'ui-core/canvas'
import { useOverlay } from 'ui-overlay'
import { formatIdentities, formatSuperIdentities } from 'utils'
import { Header } from './Header'
import { Nominations } from './Nominations'
import { Overview } from './Overview'
import { Preloader } from './Preloader'
import type { RoleIdentities } from './types'

export const Pool = () => {
  const {
    config: { options },
  } = useOverlay().canvas
  const { serviceApi } = useApi()
  const { network } = useNetwork()
  const { pluginEnabled } = usePlugins()
  const { poolsMetaData, bondedPools } = useBondedPools()
  const { ss58 } = getNetworkData(network)

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

  const initialSelectedPoolId = useMemo(
    () =>
      providedPoolId ||
      shuffledCandidates[(shuffledCandidates.length * Math.random()) << 0]
        ?.id ||
      0,
    []
  )

  // The selected bonded pool id. Assigns a random id if one is not provided
  const [selectedPoolId, setSelectedPoolId] = useState<number>(
    initialSelectedPoolId
  )

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
    const identities = formatIdentities(
      addresses,
      await serviceApi.query.identityOfMulti(addresses)
    )
    const supers = formatSuperIdentities(
      await serviceApi.query.superOfMulti(addresses)
    )
    setRoleIdentities({ identities, supers })
  }

  useEffect(() => {
    if (bondedPool) {
      const roles = Object.values(bondedPool.roles).map((role) =>
        role.address(ss58)
      )
      handleRoleIdentities([...new Set(roles)])
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
            autoSelected={!providedPoolId}
            poolCandidates={shuffledCandidates}
            providedPoolId={providedPoolId}
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
