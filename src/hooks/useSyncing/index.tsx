// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { useEffect, useRef, useState } from 'react';
import { SyncController } from 'controllers/Sync';
import type { SyncID, SyncIDConfig } from 'controllers/Sync/types';
import { isCustomEvent } from 'controllers/utils';
import { useEventListener } from 'usehooks-ts';

export const useSyncing = (config: SyncIDConfig = '*') => {
  // Retrieve the ids from the config provided.
  const ids = SyncController.getIdsFromSyncConfig(config);

  // Keep a record of active sync statuses.
  const [syncIds, setSyncIds] = useState<SyncID[]>(SyncController.syncIds);
  const syncIdsRef = useRef(syncIds);

  // Handle new syncing status events.
  const newSyncStatusCallback = async (e: Event) => {
    if (isCustomEvent(e) && SyncController.isValidSyncStatus(e)) {
      const { id, status } = e.detail;
      const ignoreEvent = ids !== '*' && !ids.includes(id);

      if (!ignoreEvent) {
        // An item is reported as syncing. Add its `id` to state if not already.
        if (status === 'syncing') {
          setStateWithRef([...syncIdsRef.current, id], setSyncIds, syncIdsRef);
        }

        // An item is reported to have completed syncing. Remove its `id` from state if present.
        if (status === 'complete' && syncIdsRef.current.includes(id)) {
          setStateWithRef(
            syncIdsRef.current.filter((syncStatus) => syncStatus !== id),
            setSyncIds,
            syncIdsRef
          );
        }
      }
    }
  };

  // Helper to determine if pool membership is syncing.
  const poolMembersipSyncing = (): boolean => {
    const POOL_SYNC_IDS: SyncID[] = [
      'initialization',
      'balances',
      'bonded-pools',
      'active-pools',
    ];
    return syncIds.some(() => POOL_SYNC_IDS.find((id) => syncIds.includes(id)));
  };

  // Bootstrap existing sync statuses of interest when hook is mounted.
  useEffect(() => {
    setStateWithRef(
      SyncController.syncIds.filter(
        (syncId) => ids === '*' || ids.includes(syncId)
      ),
      setSyncIds,
      syncIdsRef
    );
  }, []);

  // Listen for new sync events.
  const documentRef = useRef<Document>(document);
  useEventListener('new-sync-status', newSyncStatusCallback, documentRef);

  return { syncing: syncIds.length > 0, poolMembersipSyncing };
};
