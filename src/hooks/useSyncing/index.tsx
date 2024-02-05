// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import { useEffect, useRef, useState } from 'react';
import { SyncController } from 'static/SyncController';
import type { SyncID, SyncIDConfig } from 'static/SyncController/types';
import { isCustomEvent } from 'static/utils';
import { useEventListener } from 'usehooks-ts';

export const useSyncing = (config: SyncIDConfig) => {
  // Retrieve the ids from the config provided.
  const ids = SyncController.getIdsFromSyncConfig(config);

  // Retrieve any provided default syncing ids from config.
  const defaults = SyncController.getDefaultsFromConfig(config);

  // Keep a record of active sync statuses.
  const [syncIds, setSyncIds] = useState<SyncID[]>(defaults);
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

  const documentRef = useRef<Document>(document);

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

  // Listen for new active pool events.
  useEventListener('new-sync-status', newSyncStatusCallback, documentRef);

  return { syncing: syncIds.length > 0 };
};
