// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import * as defaults from './defaults';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { rmCommas } from '../../Utils';
import { APIContextInterface } from '../../types/api';

const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');
const U32_OPTS = { bitLength: 32, isLe: true };

export interface PoolsContextState {
  fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => void;
  membership: any;
  enabled: number;
  meta: any;
  stats: any;
  bondedPools: any;
}

export const PoolsContext: React.Context<PoolsContextState> =
  React.createContext({
    fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => {},
    membership: undefined,
    enabled: 0,
    meta: [],
    stats: defaults.stats,
    bondedPools: [],
  });

export const usePools = () => React.useContext(PoolsContext);

export const PoolsProvider = ({ children }: { children: React.ReactNode }) => {
  const { api, network, isReady, consts } = useApi() as APIContextInterface;
  const { poolsPalletId } = consts;
  const { features } = network;
  const { activeAccount } = useConnect();

  // whether pools are enabled
  const [enabled, setEnabled] = useState(0);

  // store pool metadata
  const [poolsConfig, setPoolsConfig]: any = useState({
    stats: defaults.stats,
    unsub: null,
  });

  // stores pool membership
  const [poolMembership, setPoolMembership]: any = useState({
    membership: undefined,
    unsub: null,
  });

  // stores the meta data batches for pool lists
  const [poolMetaBatches, _setPoolMetaBatch]: any = useState({});
  const poolMetaBatchesRef = useRef(poolMetaBatches);
  const setPoolMetaBatch = (val: any) => {
    poolMetaBatchesRef.current = val;
    _setPoolMetaBatch(val);
  };

  // stores the meta batch subscriptions for pool lists
  const [poolSubs, _setPoolSubs]: any = useState({});
  const poolSubsRef = useRef(poolSubs);
  const setPoolSubs = (val: any) => {
    poolSubsRef.current = val;
    _setPoolSubs(val);
  };

  // store bonded pools
  const [bondedPools, setBondedPools]: any = useState([]);

  // disable pools if network does not support them
  useEffect(() => {
    if (features.pools) {
      setEnabled(1);
    } else {
      setEnabled(0);
      unsubscribe();
    }
  }, [network]);

  useEffect(() => {
    if (isReady && enabled) {
      subscribeToPoolConfig();
      fetchBondedPools();
    }
    return () => {
      unsubscribe();
    };
  }, [network, isReady]);

  useEffect(() => {
    if (isReady && enabled && activeAccount) {
      subscribeToPoolMembership(activeAccount);
    }
    return () => {
      unsubscribePoolMembership();
    };
  }, [network, isReady, activeAccount]);

  // unsubscribe from any meta batches upon network change
  useEffect(() => {
    return () => {
      Object.values(poolSubsRef.current).map((batch: any, index: number) => {
        return Object.entries(batch).map(([k, v]: any) => {
          return v();
        });
      });
    };
  }, [isReady, network]);

  const unsubscribe = async () => {
    if (poolsConfig.unsub !== null) {
      poolsConfig.unsub();
    }
    setBondedPools([]);
  };

  const unsubscribePoolMembership = async () => {
    if (poolMembership?.unsub) {
      poolMembership.unsub();
    }
    setPoolMembership({
      membership: undefined,
      unsub: null,
    });
  };

  // subscribe to pool chain state
  const subscribeToPoolConfig = async () => {
    if (!api) return;

    const unsub = await api.queryMulti(
      [
        api.query.nominationPools.counterForPoolMembers,
        api.query.nominationPools.counterForBondedPools,
        api.query.nominationPools.counterForRewardPools,
        api.query.nominationPools.maxPoolMembers,
        api.query.nominationPools.maxPoolMembersPerPool,
        api.query.nominationPools.maxPools,
        api.query.nominationPools.minCreateBond,
        api.query.nominationPools.minJoinBond,
      ],
      ([
        _counterForPoolMembers,
        _counterForBondedPools,
        _counterForRewardPools,
        _maxPoolMembers,
        _maxPoolMembersPerPool,
        _maxPools,
        _minCreateBond,
        _minJoinBond,
      ]: any) => {
        // format optional configs to BN or null
        _maxPoolMembers = _maxPoolMembers.toHuman();
        if (_maxPoolMembers !== null) {
          _maxPoolMembers = new BN(rmCommas(_maxPoolMembers));
        }
        _maxPoolMembersPerPool = _maxPoolMembersPerPool.toHuman();
        if (_maxPoolMembersPerPool !== null) {
          _maxPoolMembersPerPool = new BN(rmCommas(_maxPoolMembersPerPool));
        }
        _maxPools = _maxPools.toHuman();
        if (_maxPools !== null) {
          _maxPools = new BN(rmCommas(_maxPools));
        }

        setPoolsConfig({
          ...poolsConfig,
          stats: {
            counterForPoolMembers: _counterForPoolMembers.toBn(),
            counterForBondedPools: _counterForBondedPools.toBn(),
            counterForRewardPools: _counterForRewardPools.toBn(),
            maxPoolMembers: _maxPoolMembers,
            maxPoolMembersPerPool: _maxPoolMembersPerPool,
            maxPools: _maxPools,
            minCreateBond: _minCreateBond.toBn(),
            minJoinBond: _minJoinBond.toBn(),
          },
        });
      }
    );
    setPoolsConfig({
      ...poolsConfig,
      unsub,
    });
  };

  // subscribe to accounts membership
  const subscribeToPoolMembership = async (address: string) => {
    if (!api) return;

    const unsub = await api.query.nominationPools.poolMembers(
      address,
      async (result: any) => {
        let membership = result?.unwrapOr(undefined)?.toJSON();
        if (membership) {
          let pool: any = await api.query.nominationPools.bondedPools(
            membership.poolId
          );
          pool = pool?.unwrapOr(undefined)?.toJSON();
          membership = { ...membership, pool };
        }
        setPoolMembership({ membership, unsub });
      }
    );
    return unsub;
  };

  // fetch all bonded pool entries
  const fetchBondedPools = async () => {
    if (!api) return;

    const _exposures = await api.query.nominationPools.bondedPools.entries();
    // humanise exposures to send to worker
    const exposures = _exposures.map(([_keys, _val]: any) => {
      const id = new BN(_keys.toHuman()[0]);
      return {
        ..._val.toHuman(),
        id,
        addresses: {
          stash: createAccount(id, 0),
          reward: createAccount(id, 1),
        },
      };
    });

    setBondedPools(exposures);
  };

  // generates pool stash and reward accounts. assumes poolsPalletId is synced.
  const createAccount = (poolId: BN, index: number): string => {
    if (!api) return '';

    return api.registry
      .createType(
        'AccountId32',
        u8aConcat(
          MOD_PREFIX,
          poolsPalletId,
          new Uint8Array([index]),
          bnToU8a(poolId, U32_OPTS),
          EMPTY_H256
        )
      )
      .toString();
  };

  /*
    Fetches a new batch of pool metadata.
    Fetches the metadata of a pool that we assume to be a string.
    structure:
    {
      key: {
        [
          {
          metadata: [],
        }
      ]
    },
  };
  */
  const fetchPoolsMetaBatch = async (key: string, p: any, refetch = false) => {
    if (!isReady || !api) {
      return;
    }
    if (!p.length) {
      return;
    }

    if (!refetch) {
      // if already exists, do not re-fetch
      if (poolMetaBatchesRef.current[key] !== undefined) {
        return;
      }
    } else {
      // tidy up if existing batch exists
      delete poolMetaBatches[key];
      delete poolMetaBatchesRef.current[key];

      if (poolSubsRef.current[key] !== undefined) {
        for (const unsub of poolSubsRef.current[key]) {
          unsub();
        }
      }
    }

    const ids = [];
    for (const _p of p) {
      ids.push(Number(_p.id));
    }

    // store batch ids
    const batchesUpdated = Object.assign(poolMetaBatchesRef.current);
    batchesUpdated[key] = {};
    batchesUpdated[key].ids = ids;
    setPoolMetaBatch({ ...batchesUpdated });

    const subscribeToMetadata = async (id: any) => {
      const unsub = await api.query.nominationPools.metadata.multi(
        id,
        (_metadata: any) => {
          const metadata = [];
          for (let i = 0; i < _metadata.length; i++) {
            metadata.push(_metadata[i].toHuman());
          }
          const _batchesUpdated = Object.assign(poolMetaBatchesRef.current);
          _batchesUpdated[key].metadata = metadata;
          setPoolMetaBatch({ ..._batchesUpdated });
        }
      );
      return unsub;
    };

    // initiate subscriptions
    await Promise.all([subscribeToMetadata(ids)]).then((unsubs: any) => {
      addMetaBatchUnsubs(key, unsubs);
    });
  };

  /*
   * Helper function to add mataBatch unsubs by key.
   */
  const addMetaBatchUnsubs = (key: string, unsubs: any) => {
    const _unsubs = poolSubsRef.current;
    const _keyUnsubs = _unsubs[key] ?? [];

    _keyUnsubs.push(...unsubs);
    _unsubs[key] = _keyUnsubs;
    setPoolSubs(_unsubs);
  };

  return (
    <PoolsContext.Provider
      value={{
        fetchPoolsMetaBatch,
        membership: poolMembership?.membership,
        enabled,
        stats: poolsConfig.stats,
        meta: poolMetaBatchesRef.current,
        bondedPools,
      }}
    >
      {children}
    </PoolsContext.Provider>
  );
};
