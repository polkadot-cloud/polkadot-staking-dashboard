// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils'
import { useNetwork } from 'contexts/Network'
import { ActivePools } from 'controllers/ActivePools'
import { isCustomEvent } from 'controllers/utils'
import { useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import type {
  ActiveNominationsState,
  ActivePoolsProps,
  ActivePoolsState,
} from './types'

export const useActivePools = ({ onCallback, who }: ActivePoolsProps) => {
  const { network } = useNetwork()

  // Stores active pools.
  const [activePools, setActivePools] = useState<ActivePoolsState>(
    ActivePools.getActivePool(network, who)
  )
  const activePoolsRef = useRef(activePools)

  // Store nominations of active pools.
  const [poolNominations, setPoolNominations] =
    useState<ActiveNominationsState>(
      ActivePools.getPoolNominations(network, who)
    )
  const poolNominationsRef = useRef(poolNominations)

  // Handle report of new active pool data.
  const newActivePoolCallback = async (e: Event) => {
    if (isCustomEvent(e) && ActivePools.isValidNewActivePool(e)) {
      const { address, activePool, nominations } = e.detail
      const { id } = activePool

      // Persist to active pools state for the specified account.
      if (address === who) {
        const newActivePools = { ...activePoolsRef.current }
        newActivePools[id] = activePool
        setStateWithRef(newActivePools, setActivePools, activePoolsRef)

        const newPoolNominations = { ...poolNominationsRef.current }
        newPoolNominations[id] = nominations
        setStateWithRef(
          newPoolNominations,
          setPoolNominations,
          poolNominationsRef
        )
      }

      // Call custom `onCallback` function if provided.
      if (typeof onCallback === 'function') {
        await onCallback(e.detail)
      }
    }
  }

  // Get an active pool.
  const getActivePool = (poolId: string) =>
    activePools?.[Number(poolId)] || null

  // Get an active pool's nominations.
  const getPoolNominations = (poolId: string) =>
    poolNominations?.[poolId] || null

  // Reset state on network change.
  useEffect(() => {
    setStateWithRef({}, setActivePools, activePoolsRef)
    setStateWithRef({}, setPoolNominations, poolNominationsRef)
  }, [network])

  // Update state on account change.
  useEffect(() => {
    setStateWithRef(
      ActivePools.getActivePool(network, who),
      setActivePools,
      activePoolsRef
    )
    setStateWithRef(
      ActivePools.getPoolNominations(network, who),
      setPoolNominations,
      poolNominationsRef
    )
  }, [who])

  // Listen for new active pool events.
  const documentRef = useRef<Document>(document)
  useEventListener('new-active-pool', newActivePoolCallback, documentRef)

  return {
    activePools,
    activePoolsRef,
    getActivePool,
    getPoolNominations,
  }
}
