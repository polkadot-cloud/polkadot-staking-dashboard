// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SyncConfig, SyncId } from 'types'
import { _syncStatus } from './private'

export const syncStatus$ = _syncStatus.asObservable()

export const getSyncIds = (activeIds: SyncConfig) => {
  if (activeIds === '*') {
    return _syncStatus.getValue()
  }
  return _syncStatus.getValue().filter((id) => activeIds.includes(id))
}

export const getSyncing = (id: string) =>
  _syncStatus.getValue().find((syncId) => syncId === id)

export const setSyncing = (id: SyncId) => {
  const newSyncStatus = [..._syncStatus.getValue()]
  if (!newSyncStatus.includes(id)) {
    newSyncStatus.push(id)
  }
  _syncStatus.next(newSyncStatus)
}

export const setSyncingMulti = (ids: SyncId[]) => {
  const newSyncStatus = [..._syncStatus.getValue()]
  ids.forEach((id) => {
    if (!newSyncStatus.includes(id)) {
      newSyncStatus.push(id)
    }
  })
  _syncStatus.next(newSyncStatus)
}

export const removeSyncing = (id: SyncId) => {
  const newSyncStatus = _syncStatus.getValue().filter((syncId) => syncId !== id)
  _syncStatus.next(newSyncStatus)
}

export * from './default'
