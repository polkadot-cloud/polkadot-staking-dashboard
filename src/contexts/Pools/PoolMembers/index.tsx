// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { PoolMemberContext } from 'contexts/Pools/types';
import { AnyApi, AnyMetaBatch, Fn, MaybeAccount } from 'types';
import { setStateWithRef } from 'Utils';
import { useConnect } from 'contexts/Connect';
import { defaultPoolMembers } from './defaults';
import { useApi } from '../../Api';
import { usePoolsConfig } from '../PoolsConfig';

export const PoolMembersContext =
  React.createContext<PoolMemberContext>(defaultPoolMembers);

export const usePoolMembers = () => React.useContext(PoolMembersContext);

export const PoolMembersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network, isReady } = useApi();
  const { activeAccount } = useConnect();
  const { enabled } = usePoolsConfig();

  // store pool members
  const [poolMembers, setPoolMembers] = useState<Array<any>>([]);

  // stores the meta data batches for pool member lists
  const [poolMembersMetaBatches, setPoolMembersMetaBatch]: AnyMetaBatch =
    useState({});
  const poolMembersMetaBatchesRef = useRef(poolMembersMetaBatches);

  // stores the meta batch subscriptions for pool lists
  const [poolMembersSubs, setPoolMembersSubs] = useState<{
    [key: string]: Array<Fn>;
  }>({});
  const poolMembersSubsRef = useRef(poolMembersSubs);

  // clear existing state for network refresh
  useEffect(() => {
    setPoolMembers([]);
    unsubscribeAndResetMeta();
  }, [network]);

  // clear meta state when activeAccount changes
  useEffect(() => {
    unsubscribeAndResetMeta();
  }, [activeAccount]);

  // initial setup for fetching members
  useEffect(() => {
    if (isReady && enabled) {
      // fetch bonded pools
      fetchPoolMembers();
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady, enabled]);

  const unsubscribe = () => {
    unsubscribeAndResetMeta();
    setPoolMembers([]);
  };

  const unsubscribeAndResetMeta = () => {
    Object.values(poolMembersSubsRef.current).map((batch: Array<Fn>) => {
      return Object.entries(batch).map(([, v]) => {
        return v();
      });
    });
    setStateWithRef({}, setPoolMembersMetaBatch, poolMembersMetaBatchesRef);
  };

  // fetch all pool members entries
  const fetchPoolMembers = async () => {
    if (!api) return;

    const _exposures = await api.query.nominationPools.poolMembers.entries();
    const exposures = _exposures.map(([_keys, _val]: AnyApi) => {
      const who = _keys.toHuman()[0];
      const membership = _val.toHuman();
      const { poolId } = membership;

      return {
        who,
        poolId,
      };
    });

    setPoolMembers(exposures);
  };

  const getMembersOfPool = (poolId: number) => {
    return poolMembers.filter((p: any) => p.poolId === String(poolId)) ?? null;
  };

  const getPoolMember = (who: MaybeAccount) => {
    return poolMembers.find((p: any) => p.who === who) ?? null;
  };

  // queries a  pool member and formats to `poolMembers`.
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
    if (!poolMembers.length) {
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
      delete poolMembersMetaBatches[key];
      delete poolMembersMetaBatchesRef.current[key];

      if (poolMembersSubsRef.current[key] !== undefined) {
        for (const unsub of poolMembersSubsRef.current[key]) {
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
    ]).then((unsubs: Array<Fn>) => {
      addMetaBatchUnsubs(key, unsubs);
    });
  };

  /*
   * Removes a member from the member list and updates state.
   */
  const removePoolMember = (who: MaybeAccount) => {
    const newMembers = poolMembers.filter((p: any) => p.who !== who);
    setPoolMembers(newMembers ?? []);
  };

  /*
   * Helper: to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: Array<Fn>) => {
    const _unsubs = poolMembersSubsRef.current;
    const _keyUnsubs = _unsubs[key] ?? [];
    _keyUnsubs.push(...unsubs);
    _unsubs[key] = _keyUnsubs;
    setStateWithRef(_unsubs, setPoolMembersSubs, poolMembersSubsRef);
  };

  // adds a record to poolMembers.
  // currently only used when an account joins or creates a pool.
  const addToPoolMembers = (member: any) => {
    if (!member) return;

    const exists = poolMembers.find((m: any) => m.who === member.who);
    if (!exists) {
      const _poolMembers = poolMembers.concat(member);
      setPoolMembers(_poolMembers);
    }
  };

  return (
    <PoolMembersContext.Provider
      value={{
        fetchPoolMembersMetaBatch,
        queryPoolMember,
        getMembersOfPool,
        addToPoolMembers,
        getPoolMember,
        removePoolMember,
        poolMembers,
        meta: poolMembersMetaBatchesRef.current,
      }}
    >
      {children}
    </PoolMembersContext.Provider>
  );
};
