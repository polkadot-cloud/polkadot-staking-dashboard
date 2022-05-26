// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import { useBalances } from '../Balances';
import * as defaults from './defaults';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import {
  rmCommas,
  toFixedIfNecessary,
  planckBnToUnit,
  localStorageOrDefault,
} from '../../Utils';
import { APIContextInterface } from '../../types/api';

const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');
const U32_OPTS = { bitLength: 32, isLe: true };

export interface PoolsContextState {
  isBonding: () => any;
  isNominator: () => any;
  getPoolBondedAccount: () => any;
  getPoolBondOptions: () => any;
  setTargets: (targest: any) => void;
  membership: any;
  enabled: number;
  stats: any;
  bondedPools: any;
  targets: any;
}

export const PoolsContext: React.Context<PoolsContextState> =
  React.createContext({
    isBonding: () => false,
    isNominator: () => false,
    getPoolBondedAccount: () => undefined,
    getPoolBondOptions: () => defaults.poolBondOptions,
    setTargets: (targets: any) => {},
    membership: undefined,
    enabled: 0,
    stats: defaults.stats,
    bondedPools: [],
    targets: [],
  });

export const usePools = () => React.useContext(PoolsContext);

export const PoolsProvider = ({ children }: { children: React.ReactNode }) => {
  const { api, network, isReady, consts } = useApi() as APIContextInterface;
  const { poolsPalletId } = consts;
  const { features, units } = network;

  const { activeAccount } = useConnect();
  const { getAccountBalance }: any = useBalances();
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

  // store account target validators
  const [targets, _setTargets]: any = useState(defaults.targets);

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
        let membership = result?.unwrapOr(undefined)?.toHuman();
        if (membership) {
          let pool: any = await api.query.nominationPools.bondedPools(
            membership.poolId
          );
          pool = pool?.unwrapOr(undefined)?.toHuman();
          if (pool) {
            pool = getPoolWithAddresses(membership.poolId, pool);

            const stashAddress = pool?.addresses?.stash;
            if (stashAddress) {
              // set pool staking targets
              _setTargets(
                localStorageOrDefault(
                  `${stashAddress}_pool_targets`,
                  defaults.targets,
                  true
                )
              );
            }
          }

          // format pool's unlocking chunks
          const unbondingEras: any = membership.unbondingEras;
          const unlocking = [];
          for (const [e, v] of Object.entries(unbondingEras || {})) {
            const era = rmCommas(e as string);
            const value = rmCommas(v as string);
            unlocking.push({
              era: Number(era),
              value: new BN(value),
            });
          }
          membership.points = membership.points
            ? rmCommas(membership.points)
            : '0';
          membership = { ...membership, unlocking, pool };
        }
        setPoolMembership({ membership, unsub });
      }
    );
    return unsub;
  };

  const getPoolWithAddresses = (id: number, pool: any) => {
    return {
      ...pool,
      id,
      addresses: createAccounts(id),
    };
  };

  /* Sets pools target validators in storage */
  const setTargets = (_targets: any) => {
    const stashAddress = getPoolBondedAccount();
    if (stashAddress) {
      localStorage.setItem(
        `${stashAddress}_pool_targets`,
        JSON.stringify(_targets)
      );
      _setTargets(_targets);
    }
  };

  // fetch all bonded pool entries
  const fetchBondedPools = async () => {
    if (!api) return;

    const _exposures = await api.query.nominationPools.bondedPools.entries();
    // humanise exposures to send to worker
    const exposures = _exposures.map(([_keys, _val]: any) => {
      const id = _keys.toHuman()[0];
      const pool = _val.toHuman();
      return getPoolWithAddresses(id, pool);
    });

    setBondedPools(exposures);
  };

  // generates pool stash and reward accounts. assumes poolsPalletId is synced.
  const createAccounts = (poolId: number): any => {
    const poolIdBN = new BN(poolId);
    return {
      stash: createAccount(poolIdBN, 0),
      reward: createAccount(poolIdBN, 1),
    };
  };
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

  // get the bond and unbond amounts available to the user
  const getPoolBondOptions = () => {
    if (!activeAccount) {
      return defaults.poolBondOptions;
    }
    const { free, freeAfterReserve, miscFrozen } =
      getAccountBalance(activeAccount);
    const membership = poolMembership.membership;
    const unlocking = membership?.unlocking || [];
    const points = membership?.points;
    let freeToUnbond = 0;
    const active = points ? new BN(points) : new BN(0); // point to balance ratio is 1
    if (membership) {
      freeToUnbond = toFixedIfNecessary(planckBnToUnit(active, units), units);
    }

    // total amount actively unlocking
    let totalUnlockingBn = new BN(0);
    for (const u of unlocking) {
      const { value } = u;
      totalUnlockingBn = totalUnlockingBn.add(value);
    }
    const totalUnlocking = planckBnToUnit(totalUnlockingBn, units);

    // free transferrable balance that can be bonded in the pool
    let freeToBond: any = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) -
        planckBnToUnit(miscFrozen, units),
      units
    );
    freeToBond = freeToBond < 0 ? 0 : freeToBond;

    // total possible balance that can be bonded in the pool
    const totalPossibleBond = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) - totalUnlocking,
      units
    );

    return {
      active,
      freeToBond,
      freeToUnbond,
      totalUnlocking,
      totalPossibleBond,
      totalUnlockChuncks: unlocking.length,
    };
  };

  const isBonding = () => {
    return !!poolMembership?.membership;
  };

  const isNominator = () => {
    const roles = poolMembership?.membership?.pool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }

    const result =
      activeAccount === roles?.root || activeAccount === roles?.nominator;
    return result;
  };

  const getPoolBondedAccount = () => {
    return poolMembership?.membership?.pool?.addresses?.stash;
  };

  return (
    <PoolsContext.Provider
      value={{
        isNominator,
        isBonding,
        getPoolBondedAccount,
        getPoolBondOptions,
        setTargets,
        membership: poolMembership?.membership,
        enabled,
        stats: poolsConfig.stats,
        bondedPools,
        targets,
      }}
    >
      {children}
    </PoolsContext.Provider>
  );
};
