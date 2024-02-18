// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Sync } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { usePlugins } from 'contexts/Plugins';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { useBondedPools } from '../BondedPools';
import { usePoolMembers } from '../PoolMembers';
import type { ActivePoolContextState } from './types';
import { SubscanController } from 'static/SubscanController';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import { useBalances } from 'contexts/Balances';
import { ActivePoolsController } from 'static/ActivePoolsController';
import { defaultActivePoolContext, defaultPoolRoles } from './defaults';
import { SyncController } from 'static/SyncController';
import { useActivePools } from 'hooks/useActivePools';
import BigNumber from 'bignumber.js';
import { APIController } from 'static/APIController';

export const ActivePoolContext = createContext<ActivePoolContextState>(
  defaultActivePoolContext
);

export const useActivePool = () => useContext(ActivePoolContext);

export const ActivePoolProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const { network } = useNetwork();
  const { pluginEnabled } = usePlugins();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const createPoolAccounts = useCreatePoolAccounts();
  const { getMembersOfPoolFromNode } = usePoolMembers();
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

  // Only listen to the currently selected active pool, otherwise return an empty array.
  const poolIds = activePoolIdRef.current ? [activePoolIdRef.current] : [];

  // Listen for active pools.
  const { activePools, poolNominations } = useActivePools({
    poolIds,
    onCallback: async () => {
      // Sync: active pools synced once all account pools have been reported.
      if (accountPoolIds.length <= ActivePoolsController.pools.length) {
        SyncController.dispatch('active-pools', 'complete');
      }
    },
  });

  // Store the currently active pool's pending rewards for the active account.
  const [pendingPoolRewards, setPendingPoolRewards] = useState<BigNumber>(
    new BigNumber(0)
  );

  const activePool =
    activePoolId && activePools[activePoolId]
      ? activePools[activePoolId]
      : null;

  const activePoolNominations =
    activePoolId && poolNominations[activePoolId]
      ? poolNominations[activePoolId]
      : null;

  // Store the member count of the selected pool.
  const [activePoolMemberCount, setactivePoolMemberCount] = useState<number>(0);

  // Keep track of whether the pool member count is being fetched.
  const fetchingMemberCount = useRef<Sync>('unsynced');

  // Sync active pool subscriptions.
  const syncActivePoolSubscriptions = async () => {
    if (accountPoolIds.length) {
      const newActivePools = accountPoolIds.map((pool) => ({
        id: pool,
        addresses: { ...createPoolAccounts(Number(pool)) },
      }));
      ActivePoolsController.syncPools(newActivePools);
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
      String(activePool.id) === String(membership.poolId)
    ) {
      setPendingPoolRewards(await fetchPendingRewards(membership?.address));
    } else {
      setPendingPoolRewards(new BigNumber(0));
    }
  };

  // Fetch and update unclaimed pool rewards for an address from runtime call.
  const fetchPendingRewards = async (address: string | undefined) => {
    if (address) {
      const pendingRewards =
        await APIController.api.call.nominationPoolsApi.pendingRewards(address);
      return new BigNumber(pendingRewards?.toString() || 0);
    }
    return new BigNumber(0);
  };

  // Gets the member count of the currently selected pool. If Subscan is enabled, it is used instead of the connected node.
  const getMemberCount = async () => {
    if (!activePool?.id) {
      setactivePoolMemberCount(0);
      return;
    }
    // If `Subscan` plugin is enabled, fetch member count directly from the API.
    if (
      pluginEnabled('subscan') &&
      fetchingMemberCount.current === 'unsynced'
    ) {
      fetchingMemberCount.current = 'syncing';
      const poolDetails = await SubscanController.handleFetchPoolDetails(
        activePool.id
      );
      fetchingMemberCount.current = 'synced';
      setactivePoolMemberCount(poolDetails?.member_count || 0);
      return;
    }
    // If no plugin available, fetch all pool members from RPC and filter them to determine current
    // pool member count. NOTE: Expensive operation.
    setactivePoolMemberCount(
      getMembersOfPoolFromNode(activePool?.id || 0)?.length || 0
    );
  };

  // Fetch pool member count. We use `membership` as a dependency as the member count could change
  // in the UI when active account's membership changes. NOTE: Do not have `poolMembersNode` as a
  // dependency - could trigger many re-renders if value is constantly changing - more suited as a
  // custom event.
  useEffect(() => {
    fetchingMemberCount.current = 'unsynced';
    getMemberCount();
  }, [activeAccount, activePool, membership?.poolId]);

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
  // network change; this is handled by the APIController.
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
        activePoolMemberCount,
        activePoolNominations,
        pendingPoolRewards,
      }}
    >
      {children}
    </ActivePoolContext.Provider>
  );
};
