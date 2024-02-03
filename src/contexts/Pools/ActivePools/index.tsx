// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type BigNumber from 'bignumber.js';
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
import type { AnyJson, Sync } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { usePlugins } from 'contexts/Plugins';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { useBondedPools } from '../BondedPools';
import * as defaults from './defaults';
import { usePoolMembers } from '../PoolMembers';
import type { ActivePool, ActivePoolsContextState } from './types';
import { SubscanController } from 'static/SubscanController';
import { useCreatePoolAccounts } from 'hooks/useCreatePoolAccounts';
import { useBalances } from 'contexts/Balances';
import { ActivePoolsController } from 'static/ActivePoolsController';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'static/utils';

export const ActivePoolsContext = createContext<ActivePoolsContextState>(
  defaults.defaultActivePoolContext
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
  // that this object is only recalculated when these values change. We therefore do not need to use
  // `activeAccount` or `membership` as dependencies in other effects when syncing from
  // `ActivePoolsController`.
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

  // Stores member's active pools.
  const [activePools, setActivePools] = useState<ActivePool[]>([]);
  const activePoolsRef = useRef(activePools);

  // Store active pools nominations.
  const [poolNominations, setPoolNominations] = useState<
    Record<number, AnyJson>
  >({});
  const poolNominationsRef = useRef(poolNominations);

  // Store the member count of the selected pool.
  const [selectedPoolMemberCount, setSelectedPoolMemberCount] =
    useState<number>(0);

  const fetchingMemberCount = useRef<Sync>('unsynced');

  // Store whether active pool data has been synced. This will be true if no active pool exists for
  // the active account.
  const [synced, setSynced] = useState<Sync>('unsynced');
  const syncedRef = useRef(synced);

  // Store the currently selected active pool for the UI. Should default to the membership pool (if
  // present).
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  // Get the `activePool` of the active account.
  const getActivePoolMembership = () =>
    activePoolsRef.current.find((a) => {
      const p = membership?.poolId ? String(membership.poolId) : '0';
      return String(a.id) === p;
    }) || null;

  const getSelectedActivePool = () =>
    activePoolsRef.current.find(
      (a) => String(a.id) === String(selectedPoolId)
    ) || null;

  const getSelectedPoolNominations = () =>
    poolNominationsRef.current[Number(selectedPoolId) ?? -1] ||
    defaults.defaultPoolNominations;

  // Handle active pool subscriptions.
  const initialiseActivePoolSubscriptions = async () => {
    if (accountPools.length) {
      const activePoolItems = accountPools.map((pool) => ({
        id: pool,
        addresses: { ...createPoolAccounts(Number(pool)) },
      }));
      ActivePoolsController.syncPools(activePoolItems);
    }

    // Pool subscriptions have been initialised, mark as synced.
    setStateWithRef('synced', setSynced, syncedRef);

    // assign default pool immediately if active pool not currently selected
    const defaultSelected = membership?.poolId || accountPools[0] || null;

    if (defaultSelected && !getSelectedActivePool()) {
      setSelectedPoolId(String(defaultSelected));
    }
  };

  // Unsubscribe and reset activePool and poolNominations.
  const resetActivePools = () => {
    setStateWithRef([], setActivePools, activePoolsRef);
    setStateWithRef({}, setPoolNominations, poolNominationsRef);
  };

  // Utility functions
  /*
   * updateActivePoolPendingRewards
   * A helper function to set the unclaimed rewards of an active pool.
   */
  const updateActivePoolPendingRewards = (
    pendingRewards: BigNumber,
    poolId: number
  ) => {
    if (!poolId) {
      return;
    }

    // update the active pool the account is a member of.
    setStateWithRef(
      [...activePoolsRef.current].map((a) =>
        a.id === poolId
          ? {
              ...a,
              pendingRewards,
            }
          : a
      ),
      setActivePools,
      activePoolsRef
    );
  };

  /*
   * isBonding
   * Returns whether active pool exists
   */
  const isBonding = () => !!getSelectedActivePool();

  /*
   * isNominator
   * Returns whether the active account is
   * the nominator in the active pool.
   */
  const isNominator = () => {
    const roles = getSelectedActivePool()?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.nominator;
  };

  /*
   * isOwner
   * Returns whether the active account is
   * the owner of the active pool.
   */
  const isOwner = () => {
    const roles = getSelectedActivePool()?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.root;
  };

  /*
   * isMember
   * Returns whether the active account is
   * a member of the active pool.
   */
  const isMember = () => {
    const selectedPool = getSelectedActivePool();
    const p = selectedPool ? String(selectedPool.id) : '-1';
    return String(membership?.poolId || '') === p;
  };

  /*
   * isDepositor
   * Returns whether the active account is
   * the depositor of the active pool.
   */
  const isDepositor = () => {
    const roles = getSelectedActivePool()?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.depositor;
  };

  /*
   * isBouncer
   * Returns whether the active account is
   * the depositor of the active pool.
   */
  const isBouncer = () => {
    const roles = getSelectedActivePool()?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    return activeAccount === roles?.bouncer;
  };

  /*
   * getPoolBondedAccount
   * get the stash address of the bonded pool
   * that the member is participating in.
   */
  const getPoolBondedAccount = () =>
    getSelectedActivePool()?.addresses?.stash || null;

  /*
   * Get the status of nominations.
   * Possible statuses: waiting, inactive, active.
   */
  const getNominationsStatus = () => {
    const nominations = getSelectedPoolNominations().nominations?.targets || [];
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

  /*
   * getPoolRoles
   * Returns the active pool's roles or a default roles object.
   */
  const getPoolRoles = () =>
    getSelectedActivePool()?.bondedPool?.roles || defaults.poolRoles;

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

  // Fetch and update pending rewards when membership changes.
  const updatePendingRewards = async () => {
    const pendingRewards = await ActivePoolsController.fetchPendingRewards(
      membership?.address
    );
    updateActivePoolPendingRewards(
      pendingRewards,
      getActivePoolMembership()?.id || 0
    );
  };

  // Persist the received active pool to state if it is the current membership pool.
  const newActivePoolCallback = async (e: Event) => {
    if (isCustomEvent(e) && ActivePoolsController.isValidNewActivePool(e)) {
      const { pool, nominations } = e.detail;

      // Fetch pending rewards and updated received pool record.
      pool.pendingRewards = await ActivePoolsController.fetchPendingRewards(
        membership?.address
      );

      // Persist to active pools state.
      setStateWithRef(
        [
          ...activePoolsRef.current.filter(
            (activePool) => activePool.id !== pool.id
          ),
          pool,
        ],
        setActivePools,
        activePoolsRef
      );
      // Add or replace current pool nominations in poolNominations
      const newPoolNominations = { ...poolNominationsRef.current };
      newPoolNominations[pool.id] = nominations;

      setStateWithRef(
        newPoolNominations,
        setPoolNominations,
        poolNominationsRef
      );
    }
  };

  // Initialise subscriptions to all active pools of imported accounts.
  useEffectIgnoreInitial(() => {
    if (isReady && syncedRef.current === 'unsynced') {
      setStateWithRef('syncing', setSynced, syncedRef);
      initialiseActivePoolSubscriptions();
    }
  }, [network, isReady, synced]);

  // Re-sync when `accountPools` changes.
  //
  // TODO: Only store the currently selected active pool in state.
  useEffectIgnoreInitial(() => {
    setStateWithRef('unsynced', setSynced, syncedRef);
  }, [accountPools.length]);

  // Re-calculate pending rewards when membership changes.
  useEffectIgnoreInitial(() => {
    if (isReady) {
      updatePendingRewards();
    }
  }, [network, isReady, membership]);

  // Gets the member count of the currently selected pool. If Subscan is enabled, it is used instead of the connected node.
  const getMemberCount = async () => {
    const selectedActivePool = getSelectedActivePool();

    if (!selectedActivePool?.id) {
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
        selectedActivePool.id
      );
      fetchingMemberCount.current = 'synced';
      setSelectedPoolMemberCount(poolDetails?.member_count || 0);
      return;
    }
    // If no plugin available, fetch all pool members from RPC and filter them to determine current
    // pool member count. NOTE: Expensive operation.
    setSelectedPoolMemberCount(
      getMembersOfPoolFromNode(selectedActivePool?.id || 0)?.length || 0
    );
  };

  // Fetch pool member count. We use `membership` as a dependency as the member count could change
  // in the UI when active account's membership changes. NOTE: Do not have `poolMembersNode` as a
  // dependency - could trigger many re-renders if value is constantly changing - more suited as a
  // custom event.
  useEffect(() => {
    fetchingMemberCount.current = 'unsynced';
    getMemberCount();
  }, [activeAccount, getSelectedActivePool()?.id, membership?.poolId]);

  // Reset on component unmount.
  useEffect(
    () => () => {
      resetActivePools();
    },
    [network]
  );

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
        synced: syncedRef.current,
        selectedActivePool: getSelectedActivePool(),
        poolNominations: getSelectedPoolNominations(),
        selectedPoolMemberCount,
      }}
    >
      {children}
    </ActivePoolsContext.Provider>
  );
};
