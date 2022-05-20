// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import * as defaults from './defaults';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { rmCommas } from '../../Utils';

const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');
const U32_OPTS = { bitLength: 32, isLe: true };

export interface PoolsContextState {
  membership: any;
  enabled: number;
  stats: any;
  bondedPools: any;
}

export const PoolsContext: React.Context<PoolsContextState> =
  React.createContext({
    membership: undefined,
    enabled: 0,
    stats: defaults.stats,
    bondedPools: [],
  });

export const usePools = () => React.useContext(PoolsContext);

export const PoolsProvider = (props: any) => {
  const { api, network, isReady, consts }: any = useApi();
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

  const [poolMembership, setPoolMembership]: any = useState({
    membership: undefined,
    unsub: null,
  });

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
    const unsub = await api.query.nominationPools.poolMembers(
      address,
      async (result: any) => {
        let membership = result?.unwrapOr(undefined)?.toJSON();
        if (membership) {
          let pool = await api.query.nominationPools.bondedPools(
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

  return (
    <PoolsContext.Provider
      value={{
        membership: poolMembership?.membership,
        enabled,
        stats: poolsConfig.stats,
        bondedPools,
      }}
    >
      {props.children}
    </PoolsContext.Provider>
  );
};
