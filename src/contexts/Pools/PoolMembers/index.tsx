// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { usePlugins } from 'contexts/Plugins';
import type { AnyApi, AnyMetaBatch, Fn, MaybeAddress, Sync } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { defaultPoolMembers } from './defaults';
import type { PoolMember, PoolMemberContext } from './types';

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

  // Stores the meta data batches for pool member lists.
  const [poolMembersMetaBatches, setPoolMembersMetaBatch] =
    useState<AnyMetaBatch>({});
  const poolMembersMetaBatchesRef = useRef(poolMembersMetaBatches);

  // Stores the meta batch subscriptions for pool lists.
  const poolMembersSubs = useRef<Record<string, Fn[]>>({});

  // Update poolMembersApi fetched status.
  const setFetchedPoolMembersApi = (status: Sync) => {
    fetchedPoolMembersApi.current = status;
  };

  // Clear existing state for network refresh
  useEffectIgnoreInitial(() => {
    setPoolMembersNode([]);
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
    if (!pluginEnabled('subscan')) {
      if (isReady) {
        fetchPoolMembers();
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
    unsubscribeAndResetMeta();
    setPoolMembersNode([]);
    setPoolMembersApi([]);
  };

  const unsubscribeAndResetMeta = () => {
    Object.values(poolMembersSubs.current).map((batch: Fn[]) =>
      Object.entries(batch).map(([, v]) => v())
    );
    setStateWithRef({}, setPoolMembersMetaBatch, poolMembersMetaBatchesRef);
  };

  // Fetch all pool members entries from node.
  const fetchPoolMembers = async () => {
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

  // Gets the count of members in a pool from node data.
  const getPoolMemberCount = (poolId: number) =>
    getMembersOfPoolFromNode(poolId ?? 0).length;

  /*
    Fetches a new batch of pool member metadata.
    structure:
    {
      key: {
        [
          {
          identities: [],
          super_identities: [],
        }
      ]
    },
  };
  */
  const fetchPoolMembersMetaBatch = async (
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

      if (poolMembersSubs.current[key] !== undefined) {
        for (const unsub of poolMembersSubs.current[key]) {
          unsub();
        }
      }
    }

    // aggregate member addresses
    const addresses = [];
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

    const subscribeToPoolMembers = async (addr: string[]) => {
      const unsub = await api.query.nominationPools.poolMembers.multi<AnyApi>(
        addr,
        (_pools) => {
          const pools = [];
          for (const _pool of _pools) {
            pools.push(_pool.toHuman());
          }
          const updated = Object.assign(poolMembersMetaBatchesRef.current);
          updated[key].poolMembers = pools;
          setStateWithRef(
            { ...updated },
            setPoolMembersMetaBatch,
            poolMembersMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    const subscribeToIdentities = async (addr: string[]) => {
      const unsub = await api.query.identity.identityOf.multi<AnyApi>(
        addr,
        (_identities) => {
          const identities = [];
          for (const _identity of _identities) {
            identities.push(_identity.toHuman());
          }
          const updated = Object.assign(poolMembersMetaBatchesRef.current);
          updated[key].identities = identities;
          setStateWithRef(
            { ...updated },
            setPoolMembersMetaBatch,
            poolMembersMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    const subscribeToSuperIdentities = async (addr: string[]) => {
      const unsub = await api.query.identity.superOf.multi<AnyApi>(
        addr,
        async (result) => {
          // determine where supers exist
          const supers: AnyApi = [];
          const supersWithIdentity: AnyApi = [];

          for (let i = 0; i < result.length; i++) {
            const item = result[i].toHuman();
            supers.push(item);
            if (item !== null) {
              supersWithIdentity.push(i);
            }
          }

          // get supers one-off multi query
          const query = supers
            .filter((s: AnyApi) => s !== null)
            .map((s: AnyApi) => s[0]);

          const temp = await api.query.identity.identityOf.multi<AnyApi>(
            query,
            (_identities) => {
              for (let j = 0; j < _identities.length; j++) {
                const identity = _identities[j].toHuman();
                // inject identity into super array
                supers[supersWithIdentity[j]].identity = identity;
              }
            }
          );
          temp();

          const updated = Object.assign(poolMembersMetaBatchesRef.current);
          updated[key].supers = supers;
          setStateWithRef(
            { ...updated },
            setPoolMembersMetaBatch,
            poolMembersMetaBatchesRef
          );
        }
      );
      return unsub;
    };

    // initiate subscriptions
    await Promise.all([
      subscribeToIdentities(addresses),
      subscribeToSuperIdentities(addresses),
      subscribeToPoolMembers(addresses),
    ]).then((unsubs: Fn[]) => {
      addMetaBatchUnsubs(key, unsubs);
    });
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

  /*
   * Helper: to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: Fn[]) => {
    const subs = poolMembersSubs.current;
    const sub = subs[key] ?? [];
    sub.push(...unsubs);
    subs[key] = sub;
    poolMembersSubs.current = subs;
  };

  return (
    <PoolMembersContext.Provider
      value={{
        fetchPoolMembersMetaBatch,
        queryPoolMember,
        getMembersOfPoolFromNode,
        addToPoolMembers,
        removePoolMember,
        getPoolMemberCount,
        poolMembersNode,
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
