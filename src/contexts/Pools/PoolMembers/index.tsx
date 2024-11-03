// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { usePlugins } from 'contexts/Plugins';
import type { AnyApi, AnyMetaBatch, MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { defaultPoolMembers } from './defaults';
import type { PoolMember, PoolMemberContext } from './types';
import type { AnyJson, Sync } from '@w3ux/types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'controllers/utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { PoolMembers } from 'model/Subscribe/PoolMembers';

export const PoolMembersContext =
  createContext<PoolMemberContext>(defaultPoolMembers);

export const usePoolMembers = () => useContext(PoolMembersContext);

export const PoolMembersProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { api, isReady } = useApi();
  const { pluginEnabled } = usePlugins();
  const { activeAccount } = useActiveAccounts();

  // Store pool members from node.
  const [poolMembersNode, setPoolMembersNode] = useState<PoolMember[]>([]);

  // Store pool members from api.
  const [poolMembersApi, setPoolMembersApi] = useState<PoolMember[]>([]);

  // Store whether pool members from api have been fetched.
  const fetchedPoolMembersApi = useRef<Sync>('unsynced');

  // Stores pages of metadata for pool member lists.
  const [poolMemberPages, setPoolMembersPages] = useState<AnyMetaBatch>({});
  const poolMemberPagesRef = useRef(poolMemberPages);

  // Update poolMembersApi fetched status.
  const setFetchedPoolMembersApi = (status: Sync) => {
    fetchedPoolMembersApi.current = status;
  };

  // Clear existing state for network refresh
  useEffectIgnoreInitial(() => {
    setPoolMembersNode([]);
    setPoolMembersApi([]);
    removePageSubscriptions();
  }, [network]);

  // Clear meta state when activeAccount changes
  useEffectIgnoreInitial(() => {
    removePageSubscriptions();
  }, [activeAccount]);

  // Initial setup for fetching members if Subscan is not enabled. Ensure poolMembers are reset if
  // subscan is disabled.
  useEffectIgnoreInitial(() => {
    if (!pluginEnabled('subscan')) {
      if (isReady) {
        fetchPoolMembersNode();
      }
    } else {
      setPoolMembersNode([]);
      setPoolMembersApi([]);
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady, pluginEnabled('subscan')]);

  const unsubscribe = () => {
    removePageSubscriptions();
    setPoolMembersNode([]);
    setPoolMembersApi([]);
  };

  // Remove all subscriptions and reset meta state.
  const removePageSubscriptions = () => {
    Object.keys(poolMemberPagesRef.current).map((key) =>
      SubscriptionsController.remove(network, key)
    );
    setStateWithRef({}, setPoolMembersPages, poolMemberPagesRef);
  };

  // Fetch all pool members entries from node.
  const fetchPoolMembersNode = async () => {
    if (!api) {
      return;
    }
    const result = await api.query.nominationPools.poolMembers.entries();
    const newMembers = result.map(([keys, val]: AnyApi) => {
      const who = keys.toHuman()[0];
      const { poolId } = val.toHuman();
      return {
        who,
        poolId,
      };
    });
    setPoolMembersNode(newMembers);
  };

  const getMembersOfPoolFromNode = (poolId: number) =>
    poolMembersNode.filter((p) => String(p.poolId) === String(poolId)) ?? null;

  // queries a  pool member and formats to `PoolMember`.
  const queryPoolMember = async (who: MaybeAddress) => {
    if (!api) {
      return null;
    }

    const poolMember: AnyApi = (
      await api.query.nominationPools.poolMembers(who)
    ).toHuman();

    if (!poolMember) {
      return null;
    }

    return {
      who,
      poolId: poolMember.poolId,
    } as PoolMember;
  };

  // Fetches a batch of pool member metadata.;
  const fetchPoolMembersPage = async (
    key: string,
    p: AnyMetaBatch,
    refetch = false
  ) => {
    if (!isReady || !api) {
      return;
    }
    if (!p.length) {
      return;
    }
    if (!refetch) {
      // if already exists, do not re-fetch
      if (poolMemberPagesRef.current?.[key] !== undefined) {
        return;
      }
    } else {
      // Remove the existing page if it exists and update state.
      const updatedPoolMemberPages = Object.keys(poolMemberPagesRef.current)
        .filter((k) => k !== key)
        .reduce((acc: AnyJson, k) => {
          acc[k] = poolMemberPagesRef.current[k];
          return acc;
        }, {});

      setStateWithRef(
        updatedPoolMemberPages,
        setPoolMembersPages,
        poolMemberPagesRef
      );

      // Remove the existing subscription if it exists.
      if (poolMemberPages.current?.[key] !== undefined) {
        SubscriptionsController.remove(network, key);
      }
    }

    // aggregate member addresses
    const addresses = [];
    for (const { who } of p) {
      addresses.push(who);
    }

    // Store pool member addresses as a new page record.
    initializePoolMemberPage(key, addresses);

    // Initialise subscription to pool members.
    SubscriptionsController.set(
      network,
      key,
      new PoolMembers(network, key, addresses)
    );
  };

  // Initializes a new set of pool members for a given key.
  const initializePoolMemberPage = (key: string, addresses: string[]) => {
    const updatedPages = { ...poolMemberPagesRef.current };
    updatedPages[key] = {
      addresses,
    };
    setStateWithRef(updatedPages, setPoolMembersPages, poolMemberPagesRef);
  };

  // Removes a member from the member list and updates state.
  const removePoolMember = (who: MaybeAddress) => {
    // If Subscan is enabled, update API state, otherwise, update node state.
    if (pluginEnabled('subscan')) {
      setPoolMembersApi(poolMembersApi.filter((p) => p.who !== who) ?? []);
    } else {
      setPoolMembersNode(poolMembersNode.filter((p) => p.who !== who) ?? []);
    }
  };

  // Adds a record to poolMembers.
  // Currently only used when an account joins or creates a pool.
  const addToPoolMembers = (member: { who: string; poolId: number }) => {
    if (!member || pluginEnabled('subscan')) {
      return;
    }

    const exists = poolMembersNode.find((m) => m.who === member.who);
    if (!exists) {
      setPoolMembersNode(poolMembersNode.concat(member));
    }
  };

  // Handle new pool members event.
  const handleNewPoolMembers = (e: Event) => {
    if (isCustomEvent(e)) {
      const { key, pools } = e.detail;

      const newPoolMemberPages = { ...poolMemberPagesRef.current };
      newPoolMemberPages[key].poolMembers = pools;
      setStateWithRef(
        newPoolMemberPages,
        setPoolMembersPages,
        poolMemberPagesRef
      );
    }
  };

  // Listen for new pool member pages.
  useEventListener(
    'new-pool-members',
    handleNewPoolMembers,
    useRef<Document>(document)
  );

  return (
    <PoolMembersContext.Provider
      value={{
        fetchPoolMembersPage,
        queryPoolMember,
        getMembersOfPoolFromNode,
        addToPoolMembers,
        removePoolMember,
        poolMembersNode,
        poolMembersApi,
        setPoolMembersApi,
        fetchedPoolMembersApi: fetchedPoolMembersApi.current,
        meta: poolMemberPagesRef.current,
        setFetchedPoolMembersApi,
      }}
    >
      {children}
    </PoolMembersContext.Provider>
  );
};
