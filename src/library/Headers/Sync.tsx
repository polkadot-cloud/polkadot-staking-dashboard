// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { pageFromUri, setStateWithRef } from '@polkadot-cloud/utils';
import { useLocation } from 'react-router-dom';
import { usePlugins } from 'contexts/Plugins';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { usePayouts } from 'contexts/Payouts';
import { Spinner } from './Spinner';
import { useTxMeta } from 'contexts/TxMeta';
import { useEventListener } from 'usehooks-ts';
import { useRef, useState } from 'react';
import { isCustomEvent } from 'static/utils';
import { SyncController } from 'static/SyncController';

export const Sync = () => {
  const { isSyncing } = useUi();
  const { pathname } = useLocation();
  const { pendingNonces } = useTxMeta();
  const { payoutsSynced } = usePayouts();
  const { pluginEnabled } = usePlugins();
  const { validators } = useValidators();
  const { bondedPools } = useBondedPools();
  const { poolMembersNode } = usePoolMembers();

  // Keep a record of active sync statuses.
  const [syncStatuses, setSyncStatuses] = useState<string[]>([]);
  const syncStatusesRef = useRef(syncStatuses);

  // Keep syncing if on nominate page and still fetching payouts.
  const onNominateSyncing = () => {
    if (
      pageFromUri(pathname, 'overview') === 'nominate' &&
      payoutsSynced !== 'synced'
    ) {
      return true;
    }
    return false;
  };

  // Keep syncing if on pools page and still fetching bonded pools or pool members. Ignore pool
  // member sync if Subscan is enabled.
  const onPoolsSyncing = () => {
    if (pageFromUri(pathname, 'overview') === 'pools') {
      if (
        !bondedPools.length ||
        (!poolMembersNode.length && !pluginEnabled('subscan'))
      ) {
        return true;
      }
    }
    return false;
  };

  // Keep syncing if on validators page and still fetching.
  const onValidatorsSyncing = () => {
    if (
      pageFromUri(pathname, 'overview') === 'validators' &&
      !validators.length
    ) {
      return true;
    }
    return false;
  };

  const syncing =
    isSyncing ||
    onPoolsSyncing() ||
    onNominateSyncing() ||
    onValidatorsSyncing() ||
    pendingNonces.length > 0 ||
    syncStatuses.length > 0;

  // Handle new syncing status events.
  const newSyncStatusCallback = async (e: Event) => {
    if (isCustomEvent(e) && SyncController.isValidSyncStatus(e)) {
      const { id, status } = e.detail;

      if (status === 'syncing') {
        // An item is reported as syncing. Add its `id` to state if not already.
        if (!syncStatusesRef.current.includes(id)) {
          setStateWithRef(
            [...syncStatusesRef.current, id],
            setSyncStatuses,
            syncStatusesRef
          );
        }
      } else if (status === 'complete') {
        // An item is reported to have completed syncing. Remove its `id` from state if present.
        if (syncStatusesRef.current.includes(id)) {
          const newSyncStatuses = syncStatusesRef.current.filter(
            (syncStatus) => syncStatus !== id
          );
          setStateWithRef(newSyncStatuses, setSyncStatuses, syncStatusesRef);
        }
      }
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for new active pool events.
  useEventListener('new-sync-status', newSyncStatusCallback, documentRef);

  return syncing ? <Spinner /> : null;
};
