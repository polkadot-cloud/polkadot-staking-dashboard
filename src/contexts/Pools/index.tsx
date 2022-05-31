// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { bnToU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import { useStaking } from 'contexts/Staking';
import { useNetworkMetrics } from 'contexts/Network';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { MaybeAccount } from 'types';
import { useBalances } from '../Balances';
import * as defaults from './defaults';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import {
  rmCommas,
  toFixedIfNecessary,
  planckBnToUnit,
  localStorageOrDefault,
  setStateWithRef,
} from '../../Utils';

const EMPTY_H256 = new Uint8Array(32);
const MOD_PREFIX = stringToU8a('modl');
const U32_OPTS = { bitLength: 32, isLe: true };

export interface PoolsContextState {
  fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => void;
  isBonding: () => any;
  isNominator: () => any;
  isOwner: () => any;
  isDepositor: () => any;
  getPoolBondedAccount: () => any;
  getPoolBondOptions: (a: MaybeAccount) => any;
  setTargets: (targest: any) => void;
  getNominationsStatus: () => any;
  membership: any;
  activeBondedPool: any;
  enabled: number;
  meta: any;
  stats: any;
  bondedPools: any;
  targets: any;
  poolNominations: any;
}

export const PoolsContext: React.Context<PoolsContextState> =
  React.createContext({
    fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => {},
    isBonding: () => false,
    isNominator: () => false,
    isOwner: () => false,
    isDepositor: () => false,
    getPoolBondedAccount: () => undefined,
    getPoolBondOptions: (a: MaybeAccount) => defaults.poolBondOptions,
    setTargets: (targets: any) => {},
    getNominationsStatus: () => {},
    membership: undefined,
    activeBondedPool: undefined,
    enabled: 0,
    meta: [],
    stats: defaults.stats,
    bondedPools: [],
    targets: [],
    poolNominations: defaults.poolNominations,
  });

export const usePools = () => React.useContext(PoolsContext);

export const PoolsProvider = ({ children }: { children: React.ReactNode }) => {
  const { api, network, isReady, consts } = useApi() as APIContextInterface;
  const { metrics } = useNetworkMetrics();
  const { eraStakers } = useStaking();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getAccountBalance }: any = useBalances();

  const { activeEra } = metrics;
  const { poolsPalletId } = consts;
  const { features, units } = network;

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

  // stores member's bonded pool
  const [activeBondedPool, setActiveBondedPool]: any = useState({
    pool: undefined,
    unsub: null,
  });

  // stores pool nominations
  const [poolNominations, setPoolNominations]: any = useState({
    noominations: defaults.poolNominations,
    unsub: null,
  });

  // store account target validators
  const [targets, _setTargets]: any = useState(defaults.targets);

  // stores the meta data batches for pool lists
  const [poolMetaBatches, setPoolMetaBatch]: any = useState({});
  const poolMetaBatchesRef = useRef(poolMetaBatches);

  // stores the meta batch subscriptions for pool lists
  const [poolSubs, setPoolSubs]: any = useState({});
  const poolSubsRef = useRef(poolSubs);

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
  }, [network, isReady, enabled]);

  const unsubscribe = () => {
    if (poolsConfig.unsub !== null) {
      poolsConfig.unsub();
    }
    setBondedPools([]);
  };

  useEffect(() => {
    if (isReady && enabled && activeAccount) {
      subscribeToPoolMembership(activeAccount);
    }
    return () => {
      unsubscribePoolMembership();
    };
  }, [network, isReady, activeAccount, enabled]);

  const unsubscribePoolMembership = () => {
    if (poolMembership?.unsub) {
      poolMembership.unsub();
    }
    setPoolMembership({
      membership: undefined,
      unsub: null,
    });
  };

  // subscribe to active bonded pool deatils
  useEffect(() => {
    const membership = poolMembership?.membership;
    if (isReady && enabled && membership) {
      subscribeToActiveBondedPool(membership);
    }
    return () => {
      unsubscribeActiveBondedPool();
    };
  }, [network, isReady, enabled, poolMembership?.membership]);

  const unsubscribeActiveBondedPool = () => {
    if (activeBondedPool?.unsub) {
      activeBondedPool?.unsub();
    }
  };

  // subscribe to pool nominations
  const bondedAddress = setActiveBondedPool.bondedPool?.addresses?.stash;
  useEffect(() => {
    if (isReady && enabled && bondedAddress) {
      subscribeToPoolNominations(bondedAddress);
    }
    return () => {
      unsubscribePoolNominations();
    };
  }, [network, isReady, bondedAddress, enabled]);

  const unsubscribePoolNominations = () => {
    if (poolNominations?.unsub) {
      poolNominations.unsub();
    }
    setPoolNominations({
      nominations: defaults.poolNominations,
      unsub: null,
    });
  };

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
          membership = { ...membership, unlocking };
        }
        setPoolMembership({ membership, unsub });
      }
    );
    return unsub;
  };
  const calculatePayout = (
    membership: any,
    bondedPool: any,
    rewardPool: any,
    rewardAccountBalance: BN
  ): BN => {
    const newBalance = new BN(rewardAccountBalance);
    const lastBalance = new BN(rmCommas(rewardPool.balance));
    const poolTotalEarnings = new BN(rmCommas(rewardPool.totalEarnings));
    const rewardPoints = new BN(rmCommas(rewardPool.points));
    const bondedPoints = new BN(rmCommas(bondedPool.points));
    const memberPoints = new BN(rmCommas(membership.points));
    const poolTotalEarningsAtLastClaim = new BN(
      rmCommas(membership.rewardPoolTotalEarnings)
    );

    const generatedEarning = newBalance.sub(lastBalance);
    const generatedPoints = bondedPoints.mul(generatedEarning);
    const rewardPoolCurrentRewardPoints = rewardPoints.add(generatedPoints);
    const generatedEarningSinceLastClaim = poolTotalEarnings.sub(
      poolTotalEarningsAtLastClaim
    );
    const memberCurrentRewardPoint = memberPoints.mul(
      generatedEarningSinceLastClaim
    );
    const payout = memberCurrentRewardPoint
      .mul(generatedEarningSinceLastClaim)
      .div(rewardPoolCurrentRewardPoints);

    return payout;
  };
  const subscribeToActiveBondedPool = async (membership: any) => {
    if (!api || !membership) {
      return;
    }
    const { poolId } = membership;
    const addresses = createAccounts(poolId);
    const unsub: any = await api.queryMulti(
      [
        [api.query.nominationPools.bondedPools, poolId],
        [api.query.nominationPools.rewardPools, poolId],
        [api.query.system.account, addresses.reward],
      ],
      ([bondedPool, rewardPool, { data: balance }]: any) => {
        bondedPool = bondedPool?.unwrapOr(undefined)?.toHuman();
        rewardPool = rewardPool?.unwrapOr(undefined)?.toHuman();
        if (rewardPool && bondedPool) {
          const rewardAccountBalance = balance?.free;
          const unclaimedReward = calculatePayout(
            membership,
            bondedPool,
            rewardPool,
            rewardAccountBalance
          );
          const pool = {
            ...bondedPool,
            id: poolId,
            unclaimedReward,
            addresses,
          };
          setActiveBondedPool({ pool, unsub });

          if (addresses?.stash) {
            // set pool staking targets
            _setTargets(
              localStorageOrDefault(
                `${addresses?.stash}_pool_targets`,
                defaults.targets,
                true
              )
            );
          }
        }
      }
    );
    return unsub;
  };

  const subscribeToPoolNominations = async (poolBondAddress: string) => {
    if (!api) return;
    const unsub = await api.query.staking.nominators(
      poolBondAddress,
      (nominations: any) => {
        // set pool nominations
        let _nominations = nominations.unwrapOr(null);
        if (_nominations === null) {
          _nominations = defaults.poolNominations;
        } else {
          _nominations = {
            targets: _nominations.targets.toHuman(),
            submittedIn: _nominations.submittedIn.toHuman(),
          };
        }
        setPoolNominations({ nominations: _nominations, unsub });
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
  const getPoolBondOptions = (address: MaybeAccount) => {
    if (!address) {
      return defaults.poolBondOptions;
    }
    const { freeAfterReserve, miscFrozen } = getAccountBalance(address);
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
    let totalUnlockedBn = new BN(0);

    for (const u of unlocking) {
      const { value, era } = u;
      if (activeEra.index > era) {
        totalUnlockedBn = totalUnlockedBn.add(value);
      } else {
        totalUnlockingBn = totalUnlockingBn.add(value);
      }
    }
    const totalUnlocking = planckBnToUnit(totalUnlockingBn, units);
    const totalUnlocked = planckBnToUnit(totalUnlockedBn, units);

    // free transferrable balance that can be bonded in the pool
    const freeToBond: any = Math.max(
      toFixedIfNecessary(
        planckBnToUnit(freeAfterReserve, units) -
          planckBnToUnit(miscFrozen, units) -
          totalUnlocking -
          totalUnlocked,
        units
      ),
      0
    );

    // total possible balance that can be bonded in the pool
    const totalPossibleBond = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) - totalUnlocking - totalUnlocked,
      units
    );

    return {
      active,
      freeToBond,
      freeToUnbond,
      totalUnlocking,
      totalUnlocked,
      totalPossibleBond,
      totalUnlockChuncks: unlocking.length,
    };
  };

  const isBonding = () => {
    return !!activeBondedPool?.pool;
  };

  const isNominator = () => {
    const roles = activeBondedPool.pool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    const result =
      activeAccount === roles?.root || activeAccount === roles?.nominator;
    return result;
  };

  const isOwner = () => {
    const roles = activeBondedPool.pool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    const result =
      activeAccount === roles?.root || activeAccount === roles?.stateToggler;
    return result;
  };

  const isDepositor = () => {
    const roles = activeBondedPool.pool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    const result = activeAccount === roles?.depositor;
    return result;
  };

  const getPoolBondedAccount = () => {
    return activeBondedPool.pool?.addresses?.stash;
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
    setStateWithRef(batchesUpdated, setPoolMetaBatch, poolMetaBatchesRef);

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
          setStateWithRef(
            _batchesUpdated,
            setPoolMetaBatch,
            poolMetaBatchesRef
          );
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
    setStateWithRef(_unsubs, setPoolSubs, poolSubsRef);
  };

  /*
   * Get the status of nominations.
   * Possible statuses: waiting, inactive, active.
   */
  const getNominationsStatus = () => {
    if (!targets) {
      return defaults.nominationStatus;
    }

    const { nominations } = targets;
    const statuses: any = {};
    for (const nomination of nominations) {
      const s = eraStakers.current.stakers.find(
        (_n: any) => _n.address === nomination
      );

      if (s === undefined) {
        statuses[nomination] = 'waiting';
        continue;
      }
      const exists = (s.others ?? []).find(
        (_o: any) => _o.who === activeAccount
      );
      if (exists === undefined) {
        statuses[nomination] = 'inactive';
        continue;
      }
      statuses[nomination] = 'active';
    }
    return statuses;
  };

  return (
    <PoolsContext.Provider
      value={{
        fetchPoolsMetaBatch,
        isNominator,
        isOwner,
        isDepositor,
        isBonding,
        getPoolBondedAccount,
        getPoolBondOptions,
        setTargets,
        getNominationsStatus,
        membership: poolMembership.membership,
        activeBondedPool: activeBondedPool.pool,
        enabled,
        stats: poolsConfig.stats,
        meta: poolMetaBatchesRef.current,
        bondedPools,
        targets,
        poolNominations: poolNominations.nominations,
      }}
    >
      {children}
    </PoolsContext.Provider>
  );
};
