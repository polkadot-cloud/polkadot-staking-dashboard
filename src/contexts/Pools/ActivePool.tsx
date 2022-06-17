// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import { useStaking } from 'contexts/Staking';
import { useNetworkMetrics } from 'contexts/Network';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { MaybeAccount } from 'types';
import {
  PoolsConfigContextState,
  BondedPoolsContextState,
  PoolMembershipsContextState,
  ActivePoolContextState,
} from 'types/pools';
import { BalancesContextInterface } from 'types/balances';
import { useBalances } from '../Balances';
import * as defaults from './defaults';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { usePoolsConfig } from './PoolsConfig';
import { rmCommas, localStorageOrDefault } from '../../Utils';
import { useBondedPools } from './BondedPools';
import { usePoolMemberships } from './PoolMemberships';

export const ActivePoolContext =
  React.createContext<ActivePoolContextState | null>(null);

export const useActivePool = () => React.useContext(ActivePoolContext);

export const ActivePoolProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, network, isReady, consts } = useApi() as APIContextInterface;
  const { metrics } = useNetworkMetrics();
  const { eraStakers } = useStaking();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getAccountBalance } = useBalances() as BalancesContextInterface;
  const { enabled } = usePoolsConfig() as PoolsConfigContextState;
  const { membership } = usePoolMemberships() as PoolMembershipsContextState;
  const { createAccounts } = useBondedPools() as BondedPoolsContextState;

  const { activeEra } = metrics;
  const { existentialDeposit } = consts;

  // stores member's bonded pool
  const [activeBondedPool, setActiveBondedPool]: any = useState({
    pool: undefined,
    unsub: null,
  });

  // currently nominated validators by the activeBonded pool.
  const [poolNominations, setPoolNominations]: any = useState({
    noominations: defaults.nominations,
    unsub: null,
  });

  // store account target validators
  const [targets, _setTargets]: any = useState(defaults.targets);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [network, isReady, enabled]);

  const unsubscribe = () => {
    if (activeBondedPool.unsub !== null) {
      activeBondedPool.unsub();
    }
    if (poolNominations.unsub !== null) {
      poolNominations.unsub();
    }
  };

  // subscribe to active bonded pool deatils for the active account
  useEffect(() => {
    if (isReady && enabled && membership) {
      subscribeToActiveBondedPool();
    }
    return () => {
      unsubscribeActiveBondedPool();
    };
  }, [network, isReady, enabled, membership]);

  const unsubscribeActiveBondedPool = () => {
    if (activeBondedPool?.unsub) {
      activeBondedPool?.unsub();
    }
    setActiveBondedPool({
      membership: undefined,
      unsub: null,
    });
  };

  // subscribe to pool nominations
  const bondedAddress = activeBondedPool.pool?.addresses?.stash;
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
      nominations: defaults.nominations,
      unsub: null,
    });
  };

  const calculatePayout = (
    bondedPool: any,
    rewardPool: any,
    rewardAccountBalance: BN
  ): BN => {
    // calculate the latest reward account balance minus the existential deposit
    const newRewardPoolBalance = BN.max(
      new BN(0),
      new BN(rewardAccountBalance).sub(existentialDeposit)
    );

    const lastRewardPoolBalance = new BN(rmCommas(rewardPool.balance));
    let poolTotalEarnings = new BN(rmCommas(rewardPool.totalEarnings));
    const rewardPoints = new BN(rmCommas(rewardPool.points));
    const bondedPoints = new BN(rmCommas(bondedPool.points));
    const memberPoints = new BN(rmCommas(membership.points));

    // the pool total earning the last time the member claimed his rewards
    const poolTotalEarningsAtLastClaim = new BN(
      rmCommas(membership.rewardPoolTotalEarnings)
    );

    // new generated earning
    const generatedEarning = BN.max(
      new BN(0),
      newRewardPoolBalance.sub(lastRewardPoolBalance)
    );

    // update poolTotalEarning
    poolTotalEarnings = poolTotalEarnings.add(generatedEarning);

    // The new points that will be added to the pool. For every unit of balance that has been
    // earned by the reward pool, we inflate the reward pool points by `bonded_pool.points`. In
    // effect this allows each, single unit of balance (e.g. plank) to be divvied up pro rata
    // among members based on points.
    const generatedPoints = bondedPoints.mul(generatedEarning);

    const currentRewardPoints = rewardPoints.add(generatedPoints);

    const generatedEarningSinceLastClaim = BN.max(
      new BN(0),
      poolTotalEarnings.sub(poolTotalEarningsAtLastClaim)
    );

    const memberCurrentRewardPoint = memberPoints.mul(
      generatedEarningSinceLastClaim
    );
    const payout = currentRewardPoints.isZero()
      ? new BN(0)
      : memberCurrentRewardPoint
          .mul(newRewardPoolBalance)
          .div(currentRewardPoints);

    return payout;
  };

  const subscribeToActiveBondedPool = async () => {
    if (!api || !membership) {
      return;
    }
    const { poolId } = membership;
    const addresses = createAccounts(poolId);
    const unsub: any = await api.queryMulti(
      [
        [api.query.nominationPools.bondedPools, poolId],
        [api.query.nominationPools.rewardPools, poolId],
        [api.query.staking.slashingSpans, addresses.stash],
        [api.query.system.account, addresses.reward],
      ],
      ([bondedPool, rewardPool, slashingSpans, { data: balance }]: any) => {
        bondedPool = bondedPool?.unwrapOr(undefined)?.toHuman();
        rewardPool = rewardPool?.unwrapOr(undefined)?.toHuman();
        if (rewardPool && bondedPool) {
          const slashingSpansCount = slashingSpans.isNone
            ? 0
            : slashingSpans.unwrap().prior.length + 1;
          const rewardAccountBalance = balance?.free;
          const unclaimedReward = calculatePayout(
            bondedPool,
            rewardPool,
            rewardAccountBalance
          );
          const pool = {
            ...bondedPool,
            id: poolId,
            slashingSpansCount,
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
          _nominations = defaults.nominations;
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

  const getPoolUnlocking = () => {
    return membership?.unlocking || [];
  };

  const isBonding = () => {
    return !!activeBondedPool?.pool;
  };

  const isNominator = () => {
    const roles = activeBondedPool?.pool?.roles;
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

  // get the stash address of the bonded pool that the member is participating in.
  const getPoolBondedAccount = () => {
    return activeBondedPool.pool?.addresses?.stash;
  };

  // get the bond and unbond amounts available to the user
  const getPoolBondOptions = (address: MaybeAccount) => {
    if (!address) {
      return defaults.poolBondOptions;
    }
    const { freeAfterReserve, miscFrozen } = getAccountBalance(address);
    const unlocking = membership?.unlocking || [];
    const points = membership?.points;

    // point to balance ratio is 1
    const active = points ? new BN(points) : new BN(0);
    const freeToUnbond = active;

    // total amount actively unlocking
    let totalUnlocking = new BN(0);
    let totalUnlocked = new BN(0);

    for (const u of unlocking) {
      const { value, era } = u;
      if (activeEra.index > era) {
        totalUnlocked = totalUnlocked.add(value);
      } else {
        totalUnlocking = totalUnlocking.add(value);
      }
    }

    // free transferrable balance that can be bonded in the pool
    const freeToBond: any = BN.max(
      freeAfterReserve.sub(miscFrozen).sub(totalUnlocking).sub(totalUnlocked),
      new BN(0)
    );

    // total possible balance that can be bonded in the pool
    const totalPossibleBond = BN.max(
      freeAfterReserve.sub(totalUnlocking).sub(totalUnlocked),
      new BN(0)
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

  /*
   * Get the status of nominations.
   * Possible statuses: waiting, inactive, active.
   */
  const getNominationsStatus = () => {
    if (!poolNominations) {
      return defaults.nominationStatus;
    }

    const nominations = poolNominations?.nominations?.targets || [];
    const statuses: any = {};
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

  return (
    <ActivePoolContext.Provider
      value={{
        isNominator,
        isOwner,
        isDepositor,
        isBonding,
        getPoolBondedAccount,
        getPoolBondOptions,
        getPoolUnlocking,
        setTargets,
        getNominationsStatus,
        activeBondedPool: activeBondedPool.pool,
        targets,
        poolNominations: poolNominations.nominations,
      }}
    >
      {children}
    </ActivePoolContext.Provider>
  );
};
