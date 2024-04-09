// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { useBondedPools } from '../BondedPools';
import type { ActivePoolContextState } from './types';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import { useBalances } from 'contexts/Balances';
import { ActivePoolsController } from 'controllers/ActivePoolsController';
import { defaultActivePoolContext, defaultPoolRoles } from './defaults';
import { SyncController } from 'controllers/SyncController';
import { useActivePools } from 'hooks/useActivePools';
import BigNumber from 'bignumber.js';

export const ActivePoolContext = createContext<ActivePoolContextState>(
  defaultActivePoolContext
);

export const useActivePool = () => useContext(ActivePoolContext);

export const ActivePoolProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { isReady, api } = useApi();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const createPoolAccounts = useCreatePoolAccounts();
  const { getAccountPoolRoles, bondedPools } = useBondedPools();

  const membership = getPoolMembership(activeAccount);

  // Determine active pools to subscribe to. Dependencies of `activeAccount`, and `membership` mean
  // that this object is only recalculated when these values change.
  const accountPoolIds = useMemo(() => {
    const rollPoolIds: string[] = Object.keys(
      getAccountPoolRoles(activeAccount) || {}
    );

    // If a membership subscription has resulted in an update that is inconsistent with
    // `bondedPools`, add that role to the list of the account's pool roles.
    if (
      membership?.poolId &&
      !rollPoolIds.includes(String(membership.poolId))
    ) {
      rollPoolIds.push(String(membership.poolId));
    }
    return rollPoolIds;
  }, [activeAccount, bondedPools, membership]);

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
  const { getActivePools, activePoolsRef, getPoolNominations } = useActivePools(
    {
      who: activeAccount,
      onCallback: async () => {
        // Sync: active pools synced once all account pools have been reported.
        if (
          accountPoolIds.length <=
          ActivePoolsController.getPools(activeAccount).length
        ) {
          SyncController.dispatch('active-pools', 'complete');
        }
      },
    }
  );

  // Store the currently active pool's pending rewards for the active account.
  const [pendingPoolRewards, setPendingPoolRewards] = useState<BigNumber>(
    new BigNumber(0)
  );

  const activePool = activePoolId ? getActivePools(activePoolId) : null;

  const activePoolNominations = activePoolId
    ? getPoolNominations(activePoolId)
    : null;

  // Sync active pool subscriptions.
  const syncActivePoolSubscriptions = async () => {
    if (api && accountPoolIds.length) {
      const newActivePools = accountPoolIds.map((pool) => ({
        id: pool,
        addresses: { ...createPoolAccounts(Number(pool)) },
      }));

      SyncController.dispatch('active-pools', 'syncing');
      ActivePoolsController.syncPools(api, activeAccount, newActivePools);
    } else {
      // No active pools to sync. Mark as complete.
      SyncController.dispatch('active-pools', 'complete');
    }
  };

  // Attempt to assign the default `activePoolId` if one is not currently active.
  const assignActivePoolId = () => {
    // Membership takes priority, followed by the first pool the account has a role in. Falls back
    // to `null` if no active roles are found.
    const initialActivePoolId = membership?.poolId || accountPoolIds[0] || null;
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
    if (api && address) {
      const pendingRewards =
        await api.call.nominationPoolsApi.pendingRewards(address);
      return new BigNumber(pendingRewards?.toString() || 0);
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
  }, [network, isReady, accountPoolIds]);

  // Reset everything when `activeAccount` changes.
  useEffectIgnoreInitial(() => {
    ActivePoolsController.unsubscribe();
    resetActivePoolId();
  }, [activeAccount]);

  // Reset on network change and component unmount. NOTE: ActivePoolsController also unsubscribes on
  // network change; this is handled by the Api instance.
  useEffect(() => {
    resetActivePoolId();
    return () => {
      resetActivePoolId();
    };
  }, [network]);

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
