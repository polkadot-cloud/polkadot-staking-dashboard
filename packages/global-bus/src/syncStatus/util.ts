// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SyncConfig, SyncId } from 'types'

export const getIdsFromSyncConfig = (config: SyncConfig): SyncId[] | '*' => {
  if (config === '*' || !isSyncIdArray(config)) {
    return '*'
  }
  return config
}

export const isSyncIdArray = (config: SyncConfig): config is SyncId[] =>
  Array.isArray(config) && config.every((item) => typeof item === 'string')
