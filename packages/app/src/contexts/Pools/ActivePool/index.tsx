// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { activePools$, removeSyncing } from 'global-bus'
import { useEffect, useState, type ReactNode } from 'react'
import type { ActivePool } from 'types'
import { useApi } from '../../Api'
import { defaultPoolNominations } from './defaults'
import type { ActivePoolContextState } from './types'

export const [ActivePoolContext, useActivePool] =
  createSafeContext<ActivePoolContextState>()

export const ActivePoolProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi()
  const { network } = useNetwork()
  const { getPoolMembership } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { membership } = getPoolMembership(activeAddress)

  // Store active pools state
  const [activePools, setActivePools] = useState<ActivePool[]>()

  // Determine active pool to subscribe to based on active account membership
  const accountPoolId = membership?.poolId

  // Gets an active pool from state
  const getActivePool = (poolId: number) =>
    activePools?.find((pool) => pool.id === poolId)

  // Gets an active pool's nominations
  const getPoolNominations = (poolId: number) => {
    const pool = getActivePool(Number(poolId))
    return pool?.nominators
      ? {
          targets: pool.nominators.targets,
          submittedIn: pool.nominators.submittedIn,
        }
      : defaultPoolNominations
  }
  const activePool = accountPoolId ? getActivePool(accountPoolId) : undefined

  const activePoolNominations = accountPoolId
    ? getPoolNominations(accountPoolId)
    : null

  // Returns whether the active pool is being bonded to
  const isBonding = !!activePool

  // Returns whether the active account is the nominator in the active pool
  const isNominator = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAddress || !roles) {
      return false
    }
    return activeAddress === roles?.nominator
  }

  // Returns whether the active account is the owner of the active pool
  const isOwner = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAddress || !roles) {
      return false
    }
    return activeAddress === roles?.root
  }

  // Returns whether the active account is a member of the active pool
  const isMember = () => {
    const p = activePool ? String(activePool.id) : '-1'
    return String(membership?.poolId || '') === p
  }

  // Returns whether the active account is in a pool.
  const inPool = !!(membership?.address === activeAddress)

  // Returns whether the active account is the depositor of the active pool
  const isDepositor = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAddress || !roles) {
      return false
    }
    return activeAddress === roles?.depositor
  }

  // Returns whether the active account is the depositor of the active pool
  const isBouncer = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAddress || !roles) {
      return false
    }
    return activeAddress === roles?.bouncer
  }

  // Returns the active pool's roles or the default roles object
  const getPoolRoles = () => ({
    depositor: activePool?.bondedPool?.roles?.depositor || '',
    nominator: activePool?.bondedPool?.roles?.nominator || '',
    root: activePool?.bondedPool?.roles?.root || '',
    bouncer: activePool?.bondedPool?.roles?.bouncer || '',
  })

  // Returns the unlock chunks of the active pool
  const getPoolUnlocking = () =>
    (membership?.unbondingEras || []).map(([era, value]) => ({
      era,
      value,
    }))

  // Initialise subscriptions to the active account's active pool
  useEffectIgnoreInitial(() => {
    if (isReady) {
      if (!membership) {
        removeSyncing('active-pools')
      } else if (activePools?.find((pool) => pool.id === membership.poolId)) {
        removeSyncing('active-pools')
      }
    }
  }, [network, isReady, membership])

  // Subscribe to global bus active pools
  useEffect(() => {
    const subActivePools = activePools$.subscribe((result) => {
      setActivePools(result)
    })
    return () => {
      subActivePools.unsubscribe()
    }
  }, [])

  return (
    <ActivePoolContext.Provider
      value={{
        isNominator,
        inPool,
        isOwner,
        isMember,
        isDepositor,
        isBouncer,
        isBonding,
        getPoolUnlocking,
        getPoolRoles,
        activePool,
        activePoolNominations,
      }}
    >
      {children}
    </ActivePoolContext.Provider>
  )
}
