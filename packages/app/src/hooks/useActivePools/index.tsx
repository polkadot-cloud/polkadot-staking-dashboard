// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { useEffect, useRef, useState } from 'react';
import { ActivePoolsController } from 'controllers/ActivePools';
import { isCustomEvent } from 'controllers/utils';
import { useEventListener } from 'usehooks-ts';
import type {
  ActiveNominationsState,
  ActivePoolsProps,
  ActivePoolsState,
} from './types';
import { useNetwork } from 'contexts/Network';

export const useActivePools = ({ onCallback, who }: ActivePoolsProps) => {
  const { network } = useNetwork();

  // Stores active pools.
  const [activePools, setActivePools] = useState<ActivePoolsState>(
    ActivePoolsController.getActivePools(who)
  );
  const activePoolsRef = useRef(activePools);

  // Store nominations of active pools.
  const [poolNominations, setPoolNominations] =
    useState<ActiveNominationsState>(
      ActivePoolsController.getPoolNominations(who)
    );
  const poolNominationsRef = useRef(poolNominations);

  // Handle report of new active pool data.
  const newActivePoolCallback = async (e: Event) => {
    if (isCustomEvent(e) && ActivePoolsController.isValidNewActivePool(e)) {
      const { address, pool, nominations } = e.detail;
      const { id } = pool;

      // Persist to active pools state for the specified account.
      if (address === who) {
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

      // Call custom `onCallback` function if provided.
      if (typeof onCallback === 'function') {
        await onCallback(e.detail);
      }
    }
  };

  // Get an active pool.
  const getActivePools = (poolId: string) => activePools?.[poolId] || null;

  // Get an active pool's nominations.
  const getPoolNominations = (poolId: string) =>
    poolNominations?.[poolId] || null;

  // Reset state on network change.
  useEffect(() => {
    setStateWithRef({}, setActivePools, activePoolsRef);
    setStateWithRef({}, setPoolNominations, poolNominationsRef);
  }, [network]);

  // Update state on account change.
  useEffect(() => {
    setStateWithRef(
      ActivePoolsController.getActivePools(who),
      setActivePools,
      activePoolsRef
    );
    setStateWithRef(
      ActivePoolsController.getPoolNominations(who),
      setPoolNominations,
      poolNominationsRef
    );
  }, [who]);

  // Listen for new active pool events.
  const documentRef = useRef<Document>(document);
  useEventListener('new-active-pool', newActivePoolCallback, documentRef);

  return {
    activePools,
    activePoolsRef,
    getActivePools,
    getPoolNominations,
  };
};
