// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { useEffect, useRef, useState } from 'react';
import { ActivePoolsController } from 'controllers/ActivePoolsController';
import { isCustomEvent } from 'controllers/utils';
import { useEventListener } from 'usehooks-ts';
import type {
  ActiveNominationsState,
  ActivePoolsProps,
  ActivePoolsState,
} from './types';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';

export const useActivePools = ({ onCallback, poolIds }: ActivePoolsProps) => {
  const { network } = useNetwork();
  const { activeAccount } = useActiveAccounts();

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

      // Persist to active pools state if this pool is specified in `poolIds`.
      if (
        poolIds === '*' ||
        (Array.isArray(poolIds) && poolIds.includes(String(id)))
      ) {
        const newActivePools = { ...activePoolsRef.current };
        newActivePools[id] = pool;
        setStateWithRef(newActivePools, setActivePools, activePoolsRef);

        const newPoolNominations = { ...poolNominationsRef.current };
        newPoolNominations[id] = nominations;
        setStateWithRef(
          newPoolNominations,
          setPoolNominations,
          poolNominationsRef
        );
      }
    }
  };

  const documentRef = useRef<Document>(document);

  // Bootstrap state on initial render.
  useEffect(() => {
    const initialActivePools =
      poolIds === '*'
        ? ActivePoolsController.activePools
        : Object.fromEntries(
            Object.entries(ActivePoolsController.activePools).filter(([key]) =>
              poolIds.includes(key)
            )
          );
    setStateWithRef(initialActivePools || {}, setActivePools, activePoolsRef);

    const initialPoolNominations =
      poolIds === '*'
        ? ActivePoolsController.poolNominations
        : Object.fromEntries(
            Object.entries(ActivePoolsController.poolNominations).filter(
              ([key]) => poolIds.includes(key)
            )
          );
    setStateWithRef(
      initialPoolNominations,
      setPoolNominations,
      poolNominationsRef
    );
  }, [JSON.stringify(poolIds)]);

  // Reset state on active account or network change.
  useEffect(() => {
    setStateWithRef({}, setActivePools, activePoolsRef);
    setStateWithRef({}, setPoolNominations, poolNominationsRef);
  }, [network, activeAccount]);

  // Listen for new active pool events.
  useEventListener('new-active-pool', newActivePoolCallback, documentRef);

  return { activePools, poolNominations };
};
