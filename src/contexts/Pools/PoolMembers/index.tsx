// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { setStateWithRef } from '@polkadotcloud/utils';
import { useConnect } from 'contexts/Connect';
import { usePlugins } from 'contexts/Plugins';
import type { PoolMemberContext } from 'contexts/Pools/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyApi, AnyJson, AnyMetaBatch, Fn, MaybeAccount } from 'types';
import { useApi } from '../../Api';
import { defaultPoolMembers } from './defaults';

export const PoolMembersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getPlugins } = usePlugins();
  const { activeAccount } = useConnect();
  const { api, network, isReady } = useApi();

  // Store pool members from node.
  const [poolMembersNode, setPoolMembersNode] = useState<AnyJson[]>([]);

  // Stores the meta data batches for pool member lists
  const [poolMembersMetaBatches, setPoolMembersMetaBatch]: AnyMetaBatch =
    useState({});
  const poolMembersMetaBatchesRef = useRef(poolMembersMetaBatches);

  // Stores the meta batch subscriptions for pool lists
  const poolMembersSubs = useRef<Record<string, Fn[]>>({});

  // Clear existing state for network refresh
  useEffect(() => {
    setPoolMembersNode([]);
    unsubscribeAndResetMeta();
  }, [network]);

  // Clear meta state when activeAccount changes
  useEffect(() => {
    unsubscribeAndResetMeta();
  }, [activeAccount]);

  // Initial setup for fetching members if Subscan is not enabled. Ensure poolMembers are reset if
  // subscan is disabled.
  useEffect(() => {
    if (!getPlugins().includes('subscan')) {
      if (isReady) fetchPoolMembers();
    } else {
      setPoolMembersNode([]);
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady, getPlugins().includes('subscan')]);

  const unsubscribe = () => {
    unsubscribeAndResetMeta();
    setPoolMembersNode([]);
  };

  const unsubscribeAndResetMeta = () => {
    Object.values(poolMembersSubs.current).map((batch: Fn[]) =>
      Object.entries(batch).map(([, v]) => v())
    );
    setStateWithRef({}, setPoolMembersMetaBatch, poolMembersMetaBatchesRef);
  };

  // Fetch all pool members entries from node.
  const fetchPoolMembers = async () => {
    if (!api) return;

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
    poolMembersNode.filter((p: any) => p.poolId === String(poolId)) ?? null;

  // queries a  pool member and formats to `PoolMember`.
  const queryPoolMember = async (who: MaybeAccount) => {
    if (!api) return null;

    const poolMember: AnyApi = (
      await api.query.nominationPools.poolMembers(who)
    ).toHuman();

    if (!poolMember) {
      return null;
    }
    return {
      who,
      poolId: poolMember.poolId,
    };
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
    for (const _p of p) {
      addresses.push(_p.who);
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
          for (let i = 0; i < _pools.length; i++) {
            pools.push(_pools[i].toHuman());
          }
          const _batchesUpdated = Object.assign(
            poolMembersMetaBatchesRef.current
          );
          _batchesUpdated[key].poolMembers = pools;
          setStateWithRef(
            { ..._batchesUpdated },
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
          for (let i = 0; i < _identities.length; i++) {
            identities.push(_identities[i].toHuman());
          }
          const _batchesUpdated = Object.assign(
            poolMembersMetaBatchesRef.current
          );
          _batchesUpdated[key].identities = identities;
          setStateWithRef(
            { ..._batchesUpdated },
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
        async (_supers) => {
          // determine where supers exist
          const supers: AnyApi = [];
          const supersWithIdentity: AnyApi = [];

          for (let i = 0; i < _supers.length; i++) {
            const _super = _supers[i].toHuman();
            supers.push(_super);
            if (_super !== null) {
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
                const _identity = _identities[j].toHuman();
                // inject identity into super array
                supers[supersWithIdentity[j]].identity = _identity;
              }
            }
          );
          temp();

          const _batchesUpdated = Object.assign(
            poolMembersMetaBatchesRef.current
          );
          _batchesUpdated[key].supers = supers;
          setStateWithRef(
            { ..._batchesUpdated },
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
  const removePoolMember = (who: MaybeAccount) => {
    if (!getPlugins().includes('subscan')) return;

    const newMembers = poolMembersNode.filter((p: any) => p.who !== who);
    setPoolMembersNode(newMembers ?? []);
  };

  // Adds a record to poolMembers.
  // Currently only used when an account joins or creates a pool.
  const addToPoolMembers = (member: any) => {
    if (!member || getPlugins().includes('subscan')) return;

    const exists = poolMembersNode.find((m: any) => m.who === member.who);
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
        meta: poolMembersMetaBatchesRef.current,
      }}
    >
      {children}
    </PoolMembersContext.Provider>
  );
};

export const PoolMembersContext =
  React.createContext<PoolMemberContext>(defaultPoolMembers);

export const usePoolMembers = () => React.useContext(PoolMembersContext);
