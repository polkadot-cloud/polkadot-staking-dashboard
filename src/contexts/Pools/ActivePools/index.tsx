// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
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
import { useStaking } from 'contexts/Staking';
import type { Sync } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { usePlugins } from 'contexts/Plugins';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { useBondedPools } from '../BondedPools';
import { usePoolMembers } from '../PoolMembers';
import type { ActivePool, ActivePoolsContextState } from './types';
import { SubscanController } from 'static/SubscanController';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import { useBalances } from 'contexts/Balances';
import { ActivePoolsController } from 'static/ActivePoolsController';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'static/utils';
import type { Nominations } from 'contexts/Bonded/types';
import {
  defaultActivePoolContext,
  defaultPoolNominations,
  defaultPoolRoles,
} from './defaults';
import { SyncController } from 'static/SyncController';

export const ActivePoolsContext = createContext<ActivePoolsContextState>(
  defaultActivePoolContext
);

export const useActivePools = () => useContext(ActivePoolsContext);

export const ActivePoolsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { isReady } = useApi();
  const { eraStakers } = useStaking();
  const { pluginEnabled } = usePlugins();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const createPoolAccounts = useCreatePoolAccounts();
  const { getMembersOfPoolFromNode } = usePoolMembers();
  const { getAccountPoolRoles, bondedPools } = useBondedPools();

  const membership = getPoolMembership(activeAccount);

  // Determine active pools to subscribe to. Dependencies of `activeAccount`, and `membership` mean
  // that this object is only recalculated when these values change.
  const accountPools = useMemo(() => {
    const allRolePoolIds: string[] = Object.keys(
      getAccountPoolRoles(activeAccount) || {}
    );

    // If a membership subscription has resulted in an update that is inconsistent with
    // `bondedPools`, add that role to the list of the account's pool roles.
    const p = membership?.poolId ? String(membership.poolId) : '-1';
    if (membership?.poolId && !allRolePoolIds.includes(p)) {
      allRolePoolIds.push(String(membership.poolId));
    }
    return allRolePoolIds;
  }, [activeAccount, bondedPools, membership]);

  // Store the currently selected active pool for the UI. Should default to the membership pool if
  // present. Used in event callback, therefore needs an accompanying ref.
  const [selectedPoolId, setSelectedPoolIdState] = useState<string | null>(
    null
  );
  const selectedPoolIdRef = useRef(selectedPoolId);
  const setSelectedPoolId = (id: string | null) => {
    setStateWithRef(id, setSelectedPoolIdState, selectedPoolIdRef);

    const newActivePool = id
      ? ActivePoolsController.activePools[id] || null
      : null;
    setStateWithRef(newActivePool, setActivePool, activePoolRef);
  };

  // Stores member's active pools.
  const [activePool, setActivePool] = useState<ActivePool | null>(null);
  const activePoolRef = useRef(activePool);

  // Store active pools nominations.
  const [poolNominations, setPoolNominations] = useState<Nominations | null>(
    null
  );
  const poolNominationsRef = useRef(poolNominations);

  // Store the member count of the selected pool.
  const [selectedPoolMemberCount, setSelectedPoolMemberCount] =
    useState<number>(0);

  const fetchingMemberCount = useRef<Sync>('unsynced');

  const getActivePoolNominations = () =>
    poolNominationsRef.current || defaultPoolNominations;

  // Sync active pool subscriptions.
  const syncActivePoolSubscriptions = async () => {
    if (accountPools.length) {
      const activePoolItems = accountPools.map((pool) => ({
        id: pool,
        addresses: { ...createPoolAccounts(Number(pool)) },
      }));
      ActivePoolsController.syncPools(activePoolItems);
    }

    // Assign default pool immediately if active pool not currently selected.
    const defaultSelected = membership?.poolId || accountPools[0] || null;

    if (defaultSelected && !activePool) {
      setSelectedPoolId(String(defaultSelected));
    }
  };

  // Unsubscribe and reset activePool and poolNominations.
  const resetActivePools = () => {
    setStateWithRef(null, setSelectedPoolIdState, selectedPoolIdRef);
    setStateWithRef(null, setActivePool, activePoolRef);
    setStateWithRef(null, setPoolNominations, poolNominationsRef);
  };

  // Returns whether active pool exists.
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

  // get the stash address of the bonded pool that the member is participating in.
  const getPoolBondedAccount = () => activePool?.addresses?.stash || null;

  // Get the status of nominations. Possible statuses: waiting, inactive, active.
  const getNominationsStatus = () => {
    const nominations = getActivePoolNominations().targets;
    const statuses: Record<string, string> = {};

    for (const nomination of nominations) {
      const s = eraStakers.stakers.find(
        ({ address }) => address === nomination
      );

      if (s === undefined) {
        statuses[nomination] = 'waiting';
        continue;
      }
      const exists = (s.others ?? []).find(({ who }) => who === activeAccount);
      if (exists === undefined) {
        statuses[nomination] = 'inactive';
        continue;
      }
      statuses[nomination] = 'active';
    }
    return statuses;
  };

  // Returns the active pool's roles or a default roles object.
  const getPoolRoles = () => activePool?.bondedPool?.roles || defaultPoolRoles;

  const getPoolUnlocking = () => {
    const membershipPoolId = membership?.poolId
      ? String(membership.poolId)
      : '-1';

    // exit early if the currently selected pool is not membership pool
    if (selectedPoolId !== membershipPoolId) {
      return [];
    }
    return membership?.unlocking || [];
  };

  // Fetch and update pending rewards of the active pool when membership changes.
  const updatePendingRewards = async () => {
    if (
      membership?.poolId &&
      activePool &&
      activePool?.id === membership?.poolId
    ) {
      const pendingRewards = await ActivePoolsController.fetchPendingRewards(
        membership?.address
      );
      setStateWithRef(
        { ...activePool, id: membership.poolId, pendingRewards },
        setActivePool,
        activePoolRef
      );
    }
  };

  // Persist the received active pool to state if it is the current membership pool.
  const newActivePoolCallback = async (e: Event) => {
    if (isCustomEvent(e) && ActivePoolsController.isValidNewActivePool(e)) {
      const { pool, nominations } = e.detail;
      const { id } = pool;

      // Sync: Pools Synced once all account pools have been reported.
      if (accountPools.length <= ActivePoolsController.pools.length) {
        SyncController.dispatch('active-pools', 'complete');
      }

      // Fetch pending rewards and updated received pool record.
      pool.pendingRewards = await ActivePoolsController.fetchPendingRewards(
        membership?.address
      );

      // Persist to active pools state if the pool matches the currently selected active pool for UI
      // to display.
      if (String(id) === selectedPoolIdRef.current) {
        setStateWithRef(pool, setActivePool, activePoolRef);
        setStateWithRef(nominations, setPoolNominations, poolNominationsRef);
      }
    }
  };

  // Gets the member count of the currently selected pool. If Subscan is enabled, it is used instead of the connected node.
  const getMemberCount = async () => {
    if (!activePool?.id) {
      setSelectedPoolMemberCount(0);
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
      setSelectedPoolMemberCount(poolDetails?.member_count || 0);
      return;
    }
    // If no plugin available, fetch all pool members from RPC and filter them to determine current
    // pool member count. NOTE: Expensive operation.
    setSelectedPoolMemberCount(
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
    }
  }, [network, isReady, accountPools]);

  // Reset everything when `activeAccount` changes.
  useEffectIgnoreInitial(() => {
    ActivePoolsController.unsubscribe();
    resetActivePools();
  }, [activeAccount]);

  // Reset on network change and component unmount.
  useEffect(() => {
    resetActivePools();
    return () => {
      resetActivePools();
    };
  }, [network]);

  const documentRef = useRef<Document>(document);

  // Listen for new active pool events.
  useEventListener('new-active-pool', newActivePoolCallback, documentRef);

  return (
    <ActivePoolsContext.Provider
      value={{
        isNominator,
        isOwner,
        isMember,
        isDepositor,
        isBouncer,
        isBonding,
        getPoolBondedAccount,
        getPoolUnlocking,
        getPoolRoles,
        getNominationsStatus,
        setSelectedPoolId,
        activePool,
        selectedPoolMemberCount,
        poolNominations: getActivePoolNominations(),
      }}
    >
      {children}
    </ActivePoolsContext.Provider>
  );
};
