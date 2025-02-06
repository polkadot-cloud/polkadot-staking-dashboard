// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useBalances } from 'contexts/Balances'
import { useNetwork } from 'contexts/Network'
import { ActivePools } from 'controllers/ActivePools'
import { Syncs } from 'controllers/Syncs'
import { useActivePools } from 'hooks/useActivePools'
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { ActivePoolItem } from 'types'
import { useApi } from '../../Api'
import { defaultActivePoolContext, defaultPoolRoles } from './defaults'
import type { ActivePoolContextState } from './types'

export const ActivePoolContext = createContext<ActivePoolContextState>(
  defaultActivePoolContext
)

export const useActivePool = () => useContext(ActivePoolContext)

export const ActivePoolProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi()
  const { network } = useNetwork()
  const { getPoolMembership } = useBalances()
  const { activeAccount } = useActiveAccounts()
  const createPoolAccounts = useCreatePoolAccounts()

  const membership = getPoolMembership(activeAccount)
  // Determine active pool to subscribe to based on the membership pool id
  const accountPoolId = membership?.poolId ? String(membership.poolId) : null

  // Only listen to the active account's active pool
  const { getActivePool, getPoolNominations } = useActivePools({
    who: activeAccount,
    onCallback: async () => {
      if (ActivePools.getPool(network, activeAccount)) {
        Syncs.dispatch('active-pools', 'complete')
      }
    },
  })

  const activePool = accountPoolId ? getActivePool(accountPoolId) : null
  const activePoolNominations = accountPoolId
    ? getPoolNominations(accountPoolId)
    : null

  // Sync active pool subscription
  const syncActivePool = async () => {
    if (isReady) {
      let newActivePool: ActivePoolItem[] = []
      if (accountPoolId) {
        newActivePool = [
          {
            id: accountPoolId,
            addresses: { ...createPoolAccounts(Number(accountPoolId)) },
          },
        ]
        Syncs.dispatch('active-pools', 'syncing')
      } else {
        // No active pools to sync. Mark as complete.
        Syncs.dispatch('active-pools', 'complete')
      }
      ActivePools.syncPools(network, activeAccount, newActivePool)
    }
  }

  // Returns whether the active pool is being bonded to
  const isBonding = () => !!activePool

  // Returns whether the active account is the nominator in the active pool
  const isNominator = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAccount || !roles) {
      return false
    }
    return activeAccount === roles?.nominator
  }

  // Returns whether the active account is the owner of the active pool
  const isOwner = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAccount || !roles) {
      return false
    }
    return activeAccount === roles?.root
  }

  // Returns whether the active account is a member of the active pool
  const isMember = () => {
    const p = activePool ? String(activePool.id) : '-1'
    return String(membership?.poolId || '') === p
  }

  // Returns whether the active account is in a pool.
  const inPool = () => !!membership

  // Returns whether the active account is the depositor of the active pool
  const isDepositor = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAccount || !roles) {
      return false
    }
    return activeAccount === roles?.depositor
  }

  // Returns whether the active account is the depositor of the active pool
  const isBouncer = () => {
    const roles = activePool?.bondedPool?.roles
    if (!activeAccount || !roles) {
      return false
    }
    return activeAccount === roles?.bouncer
  }

  // Returns the active pool's roles or the default roles object
  const getPoolRoles = () => activePool?.bondedPool?.roles || defaultPoolRoles

  // Returns the unlock chunks of the active pool
  const getPoolUnlocking = () => membership?.unlocking || []

  // Initialise subscriptions to the active account's active pool
  useEffectIgnoreInitial(() => {
    if (isReady) {
      syncActivePool()
    }
  }, [network, isReady, membership])

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
