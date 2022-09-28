// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { useStaking } from 'contexts/Staking';
import { AnyApi, Sync } from 'types';
import {
  ActiveBondedPoolState,
  ActivePoolContextState,
  BondedPool,
  PoolAddresses,
} from 'contexts/Pools/types';
import { rmCommas, localStorageOrDefault, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import { useApi } from '../../Api';
import { useConnect } from '../../Connect';
import { usePoolsConfig } from '../PoolsConfig';
import { usePoolMemberships } from '../PoolMemberships';

export const ActivePoolContext = React.createContext<ActivePoolContextState>(
  defaults.defaultActivePoolContext
);

export const useActivePool = () => React.useContext(ActivePoolContext);

export const ActivePoolProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network, isReady, consts } = useApi();
  const { eraStakers } = useStaking();
  const { activeAccount } = useConnect();
  const { createAccounts } = usePoolsConfig();
  const { membership } = usePoolMemberships();

  const { existentialDeposit } = consts;

  // stores member's bonded pool
  const [activeBondedPool, setActiveBondedPool] =
    useState<ActiveBondedPoolState>(null);
  const activeBondedPoolRef = useRef(activeBondedPool);

  // store active bonded pool unsub object
  const [unsubActiveBondedPool, setUnsubActiveBondedPool] = useState<
    Array<AnyApi>
  >([]);
  const unsubActiveBondedPoolRef = useRef(unsubActiveBondedPool);

  // currently nominated validators by the activeBonded pool.
  const [poolNominations, setPoolNominations] = useState<any>(
    defaults.poolNominations
  );
  const poolNominationsRef = useRef(poolNominations);

  // store pool nomination unsub object
  const [unsubPoolNominations, setUnsubPoolNominations] = useState<
    Array<AnyApi>
  >([]);
  const unsubPoolNominationsRef = useRef(unsubPoolNominations);

  // store account target validators
  const [targets, _setTargets] = useState<any>(defaults.targets);
  const targetsRef = useRef(targets);

  // store whether active pool data has been synced.
  // this will be true if no active pool exists for the active account.
  // We just need confirmation this is the case.
  const [synced, setSynced] = useState<Sync>(Sync.Unsynced);
  const syncedRef = useRef(synced);

  // re-sync when membership.poolId changes
  useEffect(() => {
    unsubscribeAll();
    setStateWithRef(Sync.Unsynced, setSynced, syncedRef);
  }, [activeAccount, membership?.poolId]);

  // subscribe to active bonded pool details for the active account
  useEffect(() => {
    if (isReady && synced === Sync.Unsynced) {
      setStateWithRef(Sync.Syncing, setSynced, syncedRef);
      subscribeToActiveBondedPool();
    }
  }, [network, isReady, synced]);

  // unsubscribe all on component unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, [network]);

  // subscribe to pool nominations
  const bondedAddress = activeBondedPoolRef.current?.addresses?.stash;
  useEffect(() => {
    if (isReady && bondedAddress) {
      unsubscribePoolNominations();
      subscribeToPoolNominations(bondedAddress);
    }
    return () => {
      unsubscribePoolNominations();
    };
  }, [network, isReady, activeBondedPool]);

  // re-calculate unclaimed payout when membership changes
  useEffect(() => {
    if (activeBondedPool && membership && isReady) {
      const unclaimedRewards = calculatePayout(
        activeBondedPoolRef.current?.bondedPool ?? defaults.bondedPool,
        activeBondedPoolRef.current?.rewardPool ?? defaults.rewardPool,
        activeBondedPoolRef.current?.rewardAccountBalance ?? new BN(0)
      );
      updateUnclaimedRewards(unclaimedRewards);
    }
  }, [
    network,
    isReady,
    activeBondedPool?.bondedPool,
    activeBondedPool?.rewardPool,
    membership,
  ]);

  // unsubscribe and reset poolNominations
  const unsubscribePoolNominations = () => {
    if (unsubPoolNominationsRef.current.length) {
      for (const unsub of unsubPoolNominationsRef.current) {
        unsub();
      }
    }
    setStateWithRef(
      defaults.poolNominations,
      setPoolNominations,
      poolNominationsRef
    );
    setStateWithRef([], setUnsubPoolNominations, unsubPoolNominationsRef);
  };

  // unsubscribe and reset activePool and poolNominations
  const unsubscribeAll = () => {
    if (unsubActiveBondedPoolRef.current.length) {
      for (const unsub of unsubActiveBondedPoolRef.current) {
        unsub();
      }
      setStateWithRef(null, setActiveBondedPool, activeBondedPoolRef);
      setStateWithRef([], setUnsubActiveBondedPool, unsubActiveBondedPoolRef);
    }
  };

  const subscribeToActiveBondedPool = async () => {
    if (!api) {
      return;
    }
    if (!membership) {
      // no membership to handle: update sycning to complete
      setStateWithRef(Sync.Synced, setSynced, syncedRef);
      return;
    }

    const { poolId } = membership;
    const addresses: PoolAddresses = createAccounts(poolId);

    // new bonded pool subscription
    const subscribeBondedPool = async (_poolId: number) => {
      const unsub: () => void = await api.queryMulti<[AnyApi, AnyApi, AnyApi]>(
        [
          [api.query.nominationPools.bondedPools, _poolId],
          [api.query.nominationPools.rewardPools, _poolId],
          [api.query.system.account, addresses.reward],
        ],
        async ([bondedPool, rewardPool, accountData]): Promise<void> => {
          const balance = accountData.data;
          bondedPool = bondedPool?.unwrapOr(undefined)?.toHuman();
          rewardPool = rewardPool?.unwrapOr(undefined)?.toHuman();

          if (rewardPool && bondedPool) {
            const rewardAccountBalance = balance?.free;
            const unclaimedRewards = calculatePayout(
              bondedPool,
              rewardPool,
              rewardAccountBalance
            );

            const pool = {
              id: _poolId,
              addresses,
              bondedPool,
              rewardPool,
              rewardAccountBalance,
              unclaimedRewards,
            };

            // set active pool state
            setStateWithRef(pool, setActiveBondedPool, activeBondedPoolRef);

            // get pool target nominations and set in state
            if (addresses?.stash) {
              const _targets = localStorageOrDefault(
                `${addresses?.stash}_pool_targets`,
                defaults.targets,
                true
              );
              // set pool staking targets
              setStateWithRef(_targets, _setTargets, targetsRef);
            }
          } else {
            setStateWithRef(defaults.targets, _setTargets, targetsRef);
          }
        }
      );
      return unsub;
    };

    // initiate subscription, treat unsubs as array.
    await Promise.all([subscribeBondedPool(poolId)]).then((unsubs: any) => {
      setStateWithRef(
        unsubs,
        setUnsubActiveBondedPool,
        unsubActiveBondedPoolRef
      );
    });
  };

  const subscribeToPoolNominations = async (poolBondAddress: string) => {
    if (!api) return;

    const subscribePoolNominations = async (_poolBondAddress: string) => {
      const unsub = await api.query.staking.nominators(
        _poolBondAddress,
        (nominations: AnyApi) => {
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

          // set pool nominations state
          setStateWithRef(_nominations, setPoolNominations, poolNominationsRef);

          // update sycning to complete
          setStateWithRef(Sync.Synced, setSynced, syncedRef);
        }
      );
      return unsub;
    };

    // initiate subscription, treat unsubs as array.
    await Promise.all([subscribePoolNominations(poolBondAddress)]).then(
      (unsubs: any) => {
        setStateWithRef(
          unsubs,
          setUnsubPoolNominations,
          unsubPoolNominationsRef
        );
      }
    );
  };

  const updateUnclaimedRewards = (amount: BN) => {
    if (activeBondedPoolRef.current !== null) {
      setStateWithRef(
        {
          ...activeBondedPoolRef.current,
          unclaimedRewards: amount,
        },
        setActiveBondedPool,
        activeBondedPoolRef
      );
    }
  };

  /*
   * setTargets
   * Sets pools target validators in storage.
   */
  const setTargets = (_targets: any) => {
    const stashAddress = getPoolBondedAccount();
    if (stashAddress) {
      localStorage.setItem(
        `${stashAddress}_pool_targets`,
        JSON.stringify(_targets)
      );
      setStateWithRef(_targets, _setTargets, targetsRef);
    }
  };

  /*
   * getPoolUnlocking
   * Checks the current membership unlocking status.
   */
  const getPoolUnlocking = () => {
    return membership?.unlocking || [];
  };

  /*
   * isBonding
   * Returns whether active pool exists
   */
  const isBonding = () => {
    return !!activeBondedPoolRef.current;
  };

  /*
   * isNominator
   * Returns whether the active account is
   * the nominator in the active pool.
   */
  const isNominator = () => {
    const roles = activeBondedPoolRef.current?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    const result =
      activeAccount === roles?.root || activeAccount === roles?.nominator;
    return result;
  };

  /*
   * isOwner
   * Returns whether the active account is
   * the owner of the active pool.
   */
  const isOwner = () => {
    const roles = activeBondedPoolRef.current?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    const result =
      activeAccount === roles?.root || activeAccount === roles?.stateToggler;
    return result;
  };

  /*
   * isDepositor
   * Returns whether the active account is
   * the depositor of the active pool.
   */
  const isDepositor = () => {
    const roles = activeBondedPoolRef.current?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    const result = activeAccount === roles?.depositor;
    return result;
  };

  /*
   * isStateToggler
   * Returns whether the active account is
   * the depositor of the active pool.
   */
  const isStateToggler = () => {
    const roles = activeBondedPoolRef.current?.bondedPool?.roles;
    if (!activeAccount || !roles) {
      return false;
    }
    const result = activeAccount === roles?.stateToggler;
    return result;
  };

  /*
   * getPoolBondedAccount
   * get the stash address of the bonded pool
   * that the member is participating in.
   */
  const getPoolBondedAccount = () => {
    return activeBondedPoolRef.current?.addresses?.stash || null;
  };

  /*
   * Get the status of nominations.
   * Possible statuses: waiting, inactive, active.
   */
  const getNominationsStatus = () => {
    const nominations = poolNominationsRef.current.nominations?.targets || [];
    const statuses: { [key: string]: string } = {};

    for (const nomination of nominations) {
      const s = eraStakers.stakers.find((_n: any) => _n.address === nomination);

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

  /*
   * getPoolRoles
   * Returns the active pool's roles or a default roles object.
   */
  const getPoolRoles = () => {
    const roles = activeBondedPoolRef.current?.bondedPool?.roles ?? null;
    if (!roles) {
      return defaults.poolRoles;
    }
    return roles;
  };

  const calculatePayout = (
    bondedPool: BondedPool,
    rewardPool: any,
    rewardAccountBalance: BN
  ): BN => {
    if (!membership) return new BN(0);

    const rewardCounterBase = new BN(10).pow(new BN(18));

    // convert needed values into BNs
    const totalRewardsClaimed = new BN(
      rmCommas(rewardPool.totalRewardsClaimed)
    );
    const lastRecordedTotalPayouts = new BN(
      rmCommas(rewardPool.lastRecordedTotalPayouts)
    );
    const memberLastRecordedRewardCounter = new BN(
      rmCommas(membership.lastRecordedRewardCounter)
    );
    const poolLastRecordedRewardCounter = new BN(
      rmCommas(rewardPool.lastRecordedRewardCounter)
    );
    const bondedPoolPoints = new BN(rmCommas(bondedPool.points));
    const points = new BN(rmCommas(membership.points));

    // calculate the latest reward account balance minus the existential deposit
    const rewardPoolBalance = BN.max(
      new BN(0),
      new BN(rewardAccountBalance).sub(existentialDeposit)
    );

    // calculate the current reward counter
    const payoutsSinceLastRecord = rewardPoolBalance
      .add(totalRewardsClaimed)
      .sub(lastRecordedTotalPayouts);

    const currentRewardCounter = (
      bondedPoolPoints.eq(new BN(0))
        ? new BN(0)
        : payoutsSinceLastRecord.mul(rewardCounterBase).div(bondedPoolPoints)
    ).add(poolLastRecordedRewardCounter);

    const pendingRewards = currentRewardCounter
      .sub(memberLastRecordedRewardCounter)
      .mul(points)
      .div(rewardCounterBase);

    return pendingRewards;
  };

  return (
    <ActivePoolContext.Provider
      value={{
        isNominator,
        isOwner,
        isDepositor,
        isStateToggler,
        isBonding,
        getPoolBondedAccount,
        getPoolUnlocking,
        getPoolRoles,
        setTargets,
        getNominationsStatus,
        synced: syncedRef.current,
        activeBondedPool: activeBondedPoolRef.current,
        targets: targetsRef.current,
        poolNominations: poolNominationsRef.current,
      }}
    >
      {children}
    </ActivePoolContext.Provider>
  );
};
