// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getSyncIds, syncStatus$ } from 'global-bus'
import { getIdsFromSyncConfig } from 'global-bus/util'
import { useEffect, useState } from 'react'
import type { SyncConfig, SyncId } from 'types'

export const useSyncing = (config: SyncConfig = '*') => {
  // Retrieve the ids from the config provided
  const ids = getIdsFromSyncConfig(config)

  // Keep a record of active sync statuses
  const [syncIds, setSyncIds] = useState<SyncId[]>(getSyncIds(ids))

  // Handle new syncing status events
  const newSyncStatusCallback = async (result: SyncId[]) => {
    const activeSyncIds = result.filter((syncId) => ids.includes(syncId))

    // Update if active sync ids are present for this hook config
    if (!(ids !== '*' && activeSyncIds.length === 0)) {
      setSyncIds(activeSyncIds)
    }
  }

  // Helper to determine if pool membership is syncing
  const poolMembersipSyncing = (): boolean => {
    const POOL_SYNC_IDS: SyncId[] = [
      'initialization',
      'bonded-pools',
      'active-pools',
    ]
    return syncIds.some(() => POOL_SYNC_IDS.find((id) => syncIds.includes(id)))
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

  return { syncing: syncIds.length > 0, poolMembersipSyncing }
}
