// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import { useEffect, useRef, useState } from 'react';
import { SyncController } from 'static/SyncController';
import type { SyncID } from 'static/SyncController/types';
import { isCustomEvent } from 'static/utils';
import { useEventListener } from 'usehooks-ts';

export const useSyncing = (ids: SyncID[]) => {
  // Keep a record of active sync statuses.
  const [syncIds, setSyncIds] = useState<SyncID[]>([]);
  const syncIdsRef = useRef(syncIds);

  // Handle new syncing status events.
  const newSyncStatusCallback = async (e: Event) => {
    if (isCustomEvent(e) && SyncController.isValidSyncStatus(e)) {
      const { id, status } = e.detail;

      // An item is reported as syncing. Add its `id` to state if not already.
      if (status === 'syncing' && ids.includes(id)) {
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
  };

  const documentRef = useRef<Document>(document);

  // Bootstrap existing sync statuses of interest when hook is mounted.
  useEffect(() => {
    setStateWithRef(
      SyncController.syncIds.filter((syncId) => ids.includes(syncId)),
      setSyncIds,
      syncIdsRef
    );
  }, []);

  // Listen for new active pool events.
  useEventListener('new-sync-status', newSyncStatusCallback, documentRef);

  return { syncing: syncIds.length > 0 };
};
