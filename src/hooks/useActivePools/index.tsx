// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import { useRef, useState } from 'react';
import { ActivePoolsController } from 'static/ActivePoolsController';
import { isCustomEvent } from 'static/utils';
import { useEventListener } from 'usehooks-ts';
import type {
  ActiveNominationsState,
  ActivePoolsProps,
  ActivePoolsState,
} from './types';

export const useActivePools = ({ onCallback, poolIds }: ActivePoolsProps) => {
  // Stores active pools.
  const [activePools, setActivePools] = useState<ActivePoolsState>({});
  const activePoolsRef = useRef(activePools);

  // Store nominations of active pools.
  const [poolNominations, setPoolNominations] =
    useState<ActiveNominationsState>({});
  const poolNominationsRef = useRef(poolNominations);

  // Handle report of new active pool data.
  const newActivePoolCallback = async (e: Event) => {
    if (isCustomEvent(e) && ActivePoolsController.isValidNewActivePool(e)) {
      const { pool, nominations } = e.detail;
      const { id } = pool;

      // Call custom `onCallback` function if provided.
      if (typeof onCallback === 'function') {
        await onCallback(e.detail);
      }

      // Persist to active pools state if this pool is specififed in `poolIds`.
      if (poolIds.includes(String(id))) {
        const newActivePools = { ...activePoolsRef.current };
        newActivePools[id] = pool;
        setStateWithRef(newActivePools, setActivePools, activePoolsRef);

        const newNominations = { ...poolNominationsRef.current };
        newNominations[id] = nominations;
        setStateWithRef(newNominations, setPoolNominations, poolNominationsRef);
      }
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for new active pool events.
  useEventListener('new-active-pool', newActivePoolCallback, documentRef);

  return { activePools, poolNominations };
};
