// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import BigNumber from 'bignumber.js'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { Syncs } from 'controllers/Syncs'
import { activePools$ } from 'global-bus'
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
  const { getStakingLedger } = useBalances()
  const { activeAddress } = useActiveAccounts()
  const { poolMembership } = getStakingLedger(activeAddress)

  // Store active pools state
  const [activePools, setActivePools] = useState<ActivePool[]>()

  // Determine active pool to subscribe to based on active account membership
  const accountPoolId = poolMembership?.poolId

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
  const isBonding = () => !!activePool

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
    return String(poolMembership?.poolId || '') === p
  }

  // Returns whether the active account is in a pool.
  const inPool = () => !!(poolMembership?.address === activeAddress)

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
    (poolMembership?.unbondingEras || []).map(([era, value]) => ({
      era,
      value: new BigNumber(value),
    }))

  // Initialise subscriptions to the active account's active pool
  useEffectIgnoreInitial(() => {
    if (isReady) {
      if (!poolMembership) {
        Syncs.dispatch('active-pools', 'complete')
      } else if (
        activePools?.find((pool) => pool.id === poolMembership.poolId)
      ) {
        Syncs.dispatch('active-pools', 'complete')
      }
    }
  }, [network, isReady, poolMembership])

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
