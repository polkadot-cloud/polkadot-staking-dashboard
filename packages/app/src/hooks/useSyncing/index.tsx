// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useBalances } from 'contexts/Balances'
import { getSyncIds, syncStatus$ } from 'global-bus'
import { getIdsFromSyncConfig } from 'global-bus/util'
import { useEffect, useState } from 'react'
import type { MaybeAddress, SyncConfig, SyncId } from 'types'

export const useSyncing = (config: SyncConfig = '*') => {
  const { getAccountBalance, getStakingLedger } = useBalances()

  // Retrieve the ids from the config provided
  const ids = getIdsFromSyncConfig(config)

  // Keep a record of active sync statuses
  const [syncIds, setSyncIds] = useState<SyncId[]>(getSyncIds(ids))

  // Handle new syncing status events
  const newSyncStatusCallback = async (result: SyncId[]) => {
    const activeSyncIds = result.filter((syncId) => syncIds.includes(syncId))
    setSyncIds(activeSyncIds)
  }

  // Helper to determine if pool membership has synced
  const poolMembersipSynced = (): boolean => {
    const POOL_SYNC_IDS: SyncId[] = [
      'initialization',
      'bonded-pools',
      'active-pools',
    ]
    const activeSyncIds = syncIds.filter((syncId) =>
      POOL_SYNC_IDS.includes(syncId)
    )
    return activeSyncIds.length > 0
  }

  // Helper to determine if account data has been synced. Also requires initialization to be
  // completed
  const accountSynced = (address: MaybeAddress) => {
    if (!address) {
      return !syncIds.includes('initialization')
    }
    const { synced: stakingLedgerSynced } = getStakingLedger(address)
    const { synced: accountBalanceSynced } = getAccountBalance(address)

    return (
      stakingLedgerSynced &&
      accountBalanceSynced &&
      !syncIds.includes('initialization')
    )
  }

  // Subscribe to global bus
  useEffect(() => {
    const subSyncStatus = syncStatus$.subscribe((result) => {
      newSyncStatusCallback(result)
    })
    return () => {
      subSyncStatus.unsubscribe()
    }
  }, [])

  return { syncing: syncIds.length > 0, poolMembersipSynced, accountSynced }
}
