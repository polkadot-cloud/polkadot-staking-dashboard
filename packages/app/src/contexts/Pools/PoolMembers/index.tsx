// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { Sync } from '@w3ux/types';
import { setStateWithRef } from '@w3ux/utils';
import { PoolMembers } from 'api/subscribe/poolMembers';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { usePlugins } from 'contexts/Plugins';
import { Subscriptions } from 'controllers/Subscriptions';
import { isCustomEvent } from 'controllers/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { AnyMetaBatch, MaybeAddress } from 'types';
import { useEventListener } from 'usehooks-ts';
import { useApi } from '../../Api';
import { defaultPoolMembers } from './defaults';
import type { PoolMember, PoolMemberContext } from './types';

export const PoolMembersContext =
  createContext<PoolMemberContext>(defaultPoolMembers);

export const usePoolMembers = () => useContext(PoolMembersContext);

export const PoolMembersProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const { network } = useNetwork();
  const { pluginEnabled } = usePlugins();
  const { activeAccount } = useActiveAccounts();

  // Store pool members from Subscan api.
  const [poolMembersApi, setPoolMembersApi] = useState<PoolMember[]>([]);

  // Store whether pool members from api have been fetched.
  const fetchedPoolMembersApi = useRef<Sync>('unsynced');

  // Stores the meta data batches for pool member lists.
  const [poolMembersMetaBatches, setPoolMembersMetaBatch] =
    useState<AnyMetaBatch>({});
  const poolMembersMetaBatchesRef = useRef(poolMembersMetaBatches);

  // Stores the meta batch subscription keys for pool lists.
  const poolMembersSubs = useRef<string[]>([]);

  // Update poolMembersApi fetched status.
  const setFetchedPoolMembersApi = (status: Sync) => {
    fetchedPoolMembersApi.current = status;
  };

  // Clear existing state for network refresh
  useEffectIgnoreInitial(() => {
    setPoolMembersApi([]);
    unsubscribeAndResetMeta();
  }, [network]);

  // Clear meta state when activeAccount changes
  useEffectIgnoreInitial(() => {
    unsubscribeAndResetMeta();
  }, [activeAccount]);

  // Initial setup for fetching members if Subscan is not enabled. Ensure poolMembers are reset if
  // subscan is disabled.
  useEffectIgnoreInitial(() => {
    if (pluginEnabled('subscan')) {
      setPoolMembersApi([]);
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady, pluginEnabled('subscan')]);

  const unsubscribe = () => {
    unsubscribeAndResetMeta();
    setPoolMembersApi([]);
  };

  const unsubscribeAndResetMeta = () => {
    Object.values(poolMembersSubs.current).map((key: string) =>
      Subscriptions.remove(network, `poolMembersBatch-${key}`)
    );
    setStateWithRef({}, setPoolMembersMetaBatch, poolMembersMetaBatchesRef);
  };

  const fetchPoolMembersMetaBatch = async (
    key: string,
    p: AnyMetaBatch,
    refetch = false
  ) => {
    if (!isReady) {
      return;
    }
    if (!p.length) {
      return;
    }
    if (!refetch) {
      // if already exists, do not re-fetch
      if (poolMembersMetaBatchesRef.current[key] !== undefined) {
        return;
      }
    } else {
      // tidy up if existing batch exists
      const updatedPoolMembersMetaBatches: AnyMetaBatch = {
        ...poolMembersMetaBatchesRef.current,
      };
      delete updatedPoolMembersMetaBatches[key];
      setStateWithRef(
        updatedPoolMembersMetaBatches,
        setPoolMembersMetaBatch,
        poolMembersMetaBatchesRef
      );

      if (key in poolMembersSubs.current) {
        Subscriptions.remove(network, `poolMembersBatch-${key}`);
        poolMembersSubs.current = poolMembersSubs.current.filter(
          (item) => item !== key
        );
      }
    }

    // aggregate member addresses
    const addresses: string[] = [];
    for (const { who } of p) {
      addresses.push(who);
    }

    // store batch addresses
    const batchesUpdated = Object.assign(poolMembersMetaBatchesRef.current);
    batchesUpdated[key] = {};
    batchesUpdated[key].addresses = addresses;
    setStateWithRef(
      { ...batchesUpdated },
      setPoolMembersMetaBatch,
      poolMembersMetaBatchesRef
    );

    // initialise subscription
    Subscriptions.set(
      network,
      `poolMembersBatch-${key}`,
      new PoolMembers(network, key, addresses)
    );

    // Record key.
    poolMembersSubs.current.push(key);
  };

  // Removes a member from the member list and updates state. Requires subscan to be enabled.
  const removePoolMember = (who: MaybeAddress) => {
    if (pluginEnabled('subscan')) {
      setPoolMembersApi(poolMembersApi.filter((p) => p.who !== who) ?? []);
    }
  };

  // Handle new pool members batch event.
  const handleNewPoolMembersBatch = (e: Event) => {
    if (isCustomEvent(e)) {
      const { key, poolMembers } = e.detail;

      const updated = Object.assign(poolMembersMetaBatchesRef.current);
      updated[key].poolMembers = poolMembers;
      setStateWithRef(
        { ...updated },
        setPoolMembersMetaBatch,
        poolMembersMetaBatchesRef
      );
    }
  };

  const documentRef = useRef<Document>(document);
  useEventListener(
    'new-pool-members-batch',
    handleNewPoolMembersBatch,
    documentRef
  );

  return (
    <PoolMembersContext.Provider
      value={{
        fetchPoolMembersMetaBatch,
        removePoolMember,
        poolMembersApi,
        setPoolMembersApi,
        fetchedPoolMembersApi: fetchedPoolMembersApi.current,
        meta: poolMembersMetaBatchesRef.current,
        setFetchedPoolMembersApi,
      }}
    >
      {children}
    </PoolMembersContext.Provider>
  );
};
