// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { PoolMemberContext } from 'contexts/Pools/types';
import { AnyApi, AnyMetaBatch, Fn, MaybeAccount } from 'types';
import { setStateWithRef } from 'Utils';
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
    setStateWithRef({}, setPoolMembersMetaBatch, poolMembersMetaBatchesRef);
  }, [network]);

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
    Object.values(poolMembersSubsRef.current).map((batch: Array<Fn>) => {
      return Object.entries(batch).map(([, v]) => {
        return v();
      });
    });
    setPoolMembers([]);
  };

  // fetch all pool members entries
  const fetchPoolMembers = async () => {
    if (!api) return;

    const _exposures = await api.query.nominationPools.poolMembers.entries();
    const exposures = _exposures.map(([_keys, _val]: AnyApi) => {
      const who = _keys.toHuman()[0];
      const membership = _val.toHuman();
      return {
        ...membership,
        who,
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
    ]).then((unsubs: Array<Fn>) => {
      addMetaBatchUnsubs(key, unsubs);
    });
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

  return (
    <PoolMembersContext.Provider
      value={{
        fetchPoolMembersMetaBatch,
        getMembersOfPool,
        getPoolMember,
        poolMembers,
        meta: poolMembersMetaBatchesRef.current,
      }}
    >
      {children}
    </PoolMembersContext.Provider>
  );
};
