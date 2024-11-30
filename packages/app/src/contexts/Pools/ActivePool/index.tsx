// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { setStateWithRef } from '@w3ux/utils';
import { PoolPendingRewards } from 'api/runtimeApi/poolPendingRewards';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBalances } from 'contexts/Balances';
import { useNetwork } from 'contexts/Network';
import { ActivePools } from 'controllers/ActivePools';
import { Apis } from 'controllers/Apis';
import { Syncs } from 'controllers/Syncs';
import { useActivePools } from 'hooks/useActivePools';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { SystemChainId } from 'types';
import { useApi } from '../../Api';
import { defaultActivePoolContext, defaultPoolRoles } from './defaults';
import type { ActivePoolContextState } from './types';

export const ActivePoolContext = createContext<ActivePoolContextState>(
  defaultActivePoolContext
);

export const useActivePool = () => useContext(ActivePoolContext);

export const ActivePoolProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const { network } = useNetwork();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const createPoolAccounts = useCreatePoolAccounts();

  const membership = getPoolMembership(activeAccount);

  // Determine active pools to subscribe to. Dependencies of `activeAccount`, and `membership` mean
  // that this object is only recalculated when these values change.
  const accountPoolId = membership?.poolId ? String(membership.poolId) : null;

  // Store the currently selected active pool for the UI. Should default to the membership pool if
  // present. Used in event callback, therefore needs an accompanying ref.
  const [activePoolId, setActivePoolIdState] = useState<string | null>(null);
  const activePoolIdRef = useRef(activePoolId);

  const setActivePoolId = (id: string | null) => {
    setStateWithRef(id, setActivePoolIdState, activePoolIdRef);
  };

  // Only listen to the active account's active pools, otherwise return an empty array. NOTE:
  // `activePoolsRef` is needed to check if the pool has changed after the async call of fetching
  // pending rewards.
  const { getActivePool, activePoolsRef, getPoolNominations } = useActivePools({
    who: activeAccount,
    onCallback: async () => {
      if (ActivePools.getPool(network, activeAccount)) {
        Syncs.dispatch('active-pools', 'complete');
      }
    },
  });

  // Store the currently active pool's pending rewards for the active account.
  const [pendingPoolRewards, setPendingPoolRewards] = useState<BigNumber>(
    new BigNumber(0)
  );

  const activePool = activePoolId ? getActivePool(activePoolId) : null;

  const activePoolNominations = activePoolId
    ? getPoolNominations(activePoolId)
    : null;

  // Sync active pool subscriptions.
  const syncActivePoolSubscriptions = async () => {
    if (isReady && accountPoolId) {
      const newActivePool = [
        {
          id: accountPoolId,
          addresses: { ...createPoolAccounts(Number(accountPoolId)) },
        },
      ];

      Syncs.dispatch('active-pools', 'syncing');
      const peopleApi = Apis.getApi(`people-${network}` as SystemChainId);

      if (peopleApi) {
        ActivePools.syncPools(network, activeAccount, newActivePool);
      }
    } else {
      // No active pools to sync. Mark as complete.
      Syncs.dispatch('active-pools', 'complete');
    }
  };

  // Attempt to assign the default `activePoolId` if one is not currently active.
  const assignActivePoolId = () => {
    // Membership takes priority, followed by the first pool the account has a role in. Falls back
    // to `null` if no active roles are found.
    const initialActivePoolId = membership?.poolId || null;
    if (initialActivePoolId && !activePool) {
      setActivePoolId(String(initialActivePoolId));
    }
  };

  // Reset `activePoolId`.
  const resetActivePoolId = () => {
    setStateWithRef(null, setActivePoolIdState, activePoolIdRef);
  };

  // Returns whether the active pool is being bonded to (essentially if there is indeed an
  // activePool).
  const isBonding = () => !!activePool;

  // Returns whether the active account is the nominator in the active pool.
  const isNominator = () => {
    const roles = activePool?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.nominator;
  };

  // Returns whether the active account is the owner of the active pool.
  const isOwner = () => {
    const roles = activePool?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.root;
  };

  // Returns whether the active account is a member of the active pool.
  const isMember = () => {
    const p = activePool ? String(activePool.id) : '-1';
    return String(membership?.poolId || '') === p;
  };

  // Returns whether the active account is the depositor of the active pool.
  const isDepositor = () => {
    const roles = activePool?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.depositor;
  };

  // Returns whether the active account is the depositor of the active pool.
  const isBouncer = () => {
    const roles = activePool?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.bouncer;
  };

  // Returns the active pool's roles or the default roles object.
  const getPoolRoles = () => activePool?.bondedPool?.roles || defaultPoolRoles;

  // Returns the unlock chunks of the active pool if `activeAccount` is a member of the pool.
  const getPoolUnlocking = () => {
    // exit early if the active pool is not membership pool
    if (activePoolId !== String(membership?.poolId || -1)) {
      return [];
    }
    return membership?.unlocking || [];
  };

  // Fetch and update pending rewards of the active pool when membership changes.
  const updatePendingRewards = async () => {
    if (
      activePool &&
      membership?.poolId &&
      membership?.address &&
      String(activePool.id) === String(membership.poolId)
    ) {
      const pendingRewards = await fetchPendingRewards(membership.address);

      // Check if active pool has changed in the time the pending rewards were being fetched. If it
      // has, do not update.
      if (
        activePoolId &&
        activePoolsRef.current[activePoolId]?.id ===
          Number(membership.poolId || -1)
      ) {
        setPendingPoolRewards(pendingRewards);
      }
    } else {
      setPendingPoolRewards(new BigNumber(0));
    }
  };

  // Fetch and update unclaimed pool rewards for an address from runtime call.
  const fetchPendingRewards = async (address: string | undefined) => {
    const api = Apis.getApi(network);
    if (api && address) {
      const apiResult = await new PoolPendingRewards(network, address).fetch();
      return new BigNumber(apiResult?.toString() || 0);
    }
    return new BigNumber(0);
  };

  // Re-calculate pending rewards when membership changes.
  useEffectIgnoreInitial(() => {
    if (isReady) {
      updatePendingRewards();
    }
  }, [network, isReady, membership, activePool]);

  // Initialise subscriptions to all active pools of imported accounts.
  useEffectIgnoreInitial(() => {
    if (isReady) {
      syncActivePoolSubscriptions();
      assignActivePoolId();
    }
  }, [network, isReady, membership]);

  // Reset on network change and component unmount. NOTE: ActivePools also unsubscribes on
  // network change; this is handled by the Api instance.
  useEffectIgnoreInitial(() => {
    resetActivePoolId();
    return () => {
      resetActivePoolId();
    };
  }, [activeAccount, network]);

  return (
    <ActivePoolContext.Provider
      value={{
        isNominator,
        isOwner,
        isMember,
        isDepositor,
        isBouncer,
        isBonding,
        getPoolUnlocking,
        getPoolRoles,
        setActivePoolId,
        activePool,
        activePoolNominations,
        pendingPoolRewards,
      }}
    >
      {children}
    </ActivePoolContext.Provider>
  );
};
