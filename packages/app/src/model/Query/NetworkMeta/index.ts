// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { APIActiveEra } from 'contexts/Api/types';
import { stringToBn } from 'library/Utils';
import type { PapiApi } from 'model/Api/types';

export class NetworkMeta {
  // Fetch network constants.
  async fetch(pApi: PapiApi, activeEra: APIActiveEra, previousEra: BigNumber) {
    const totalIssuance = await pApi.query.Balances.TotalIssuance.getValue();

    const [
      auctionCounter,
      earliestStoredSession,
      erasToCheckPerBlock,
      minimumActiveStake,
      counterForPoolMembers,
      counterForBondedPools,
      counterForRewardPools,
      lastPoolId,
      maxPoolMembersRaw,
      maxPoolMembersPerPoolRaw,
      maxPoolsRaw,
      minCreateBond,
      minJoinBond,
      globalMaxCommission,
      counterForNominators,
      counterForValidators,
      maxValidatorsCount,
      validatorCount,
      prevErasValidatorReward,
      prevEraErasTotalStake,
      minNominatorBond,
      activeEraErasTotalStake,
    ] = await Promise.all([
      pApi.query.Auctions.AuctionCounter.getValue(),
      pApi.query.ParaSessionInfo.EarliestStoredSession.getValue(),
      pApi.query.FastUnstake.ErasToCheckPerBlock.getValue(),
      pApi.query.Staking.MinimumActiveStake.getValue(),
      pApi.query.NominationPools.CounterForPoolMembers.getValue(),
      pApi.query.NominationPools.CounterForBondedPools.getValue(),
      pApi.query.NominationPools.CounterForRewardPools.getValue(),
      pApi.query.NominationPools.LastPoolId.getValue(),
      pApi.query.NominationPools.MaxPoolMembers.getValue(),
      pApi.query.NominationPools.MaxPoolMembersPerPool.getValue(),
      pApi.query.NominationPools.MaxPools.getValue(),
      pApi.query.NominationPools.MinCreateBond.getValue(),
      pApi.query.NominationPools.MinJoinBond.getValue(),
      pApi.query.NominationPools.GlobalMaxCommission.getValue(),
      pApi.query.Staking.CounterForNominators.getValue(),
      pApi.query.Staking.CounterForValidators.getValue(),
      pApi.query.Staking.MaxValidatorsCount.getValue(),
      pApi.query.Staking.ValidatorCount.getValue(),
      pApi.query.Staking.ErasValidatorReward.getValue(previousEra.toString()),
      pApi.query.Staking.ErasTotalStake.getValue(previousEra.toString()),
      pApi.query.Staking.MinNominatorBond.getValue(),
      pApi.query.Staking.ErasTotalStake.getValue(activeEra.index.toString()),
    ]);

    // Format globalMaxCommission from a perbill to a percent.
    const globalMaxCommissionAsPercent = BigInt(globalMaxCommission) / 1000000n;

    // Format max pool members to be a BigNumber, or null if it's not set.
    const maxPoolMembers = maxPoolMembersRaw
      ? new BigNumber(maxPoolMembersRaw.toString())
      : null;

    // Format max pool members per pool to be a BigNumber, or null if it's not set.
    const maxPoolMembersPerPool = maxPoolMembersPerPoolRaw
      ? new BigNumber(maxPoolMembersPerPoolRaw.toString())
      : null;

    // Format max pools to be a BigNumber, or null if it's not set.
    const maxPools = maxPoolsRaw ? new BigNumber(maxPoolsRaw.toString()) : null;

    return {
      networkMetrics: {
        totalIssuance: new BigNumber(totalIssuance.toString()),
        auctionCounter: new BigNumber(auctionCounter.toString()),
        earliestStoredSession: new BigNumber(earliestStoredSession.toString()),
        fastUnstakeErasToCheckPerBlock: Number(erasToCheckPerBlock.toString()),
        minimumActiveStake: new BigNumber(minimumActiveStake.toString()),
      },
      poolsConfig: {
        counterForPoolMembers: stringToBn(counterForPoolMembers.toString()),
        counterForBondedPools: stringToBn(counterForBondedPools.toString()),
        counterForRewardPools: stringToBn(counterForRewardPools.toString()),
        lastPoolId: stringToBn(lastPoolId.toString()),
        maxPoolMembers,
        maxPoolMembersPerPool,
        maxPools,
        minCreateBond: stringToBn(minCreateBond.toString()),
        minJoinBond: stringToBn(minJoinBond.toString()),
        globalMaxCommission: Number(globalMaxCommissionAsPercent.toString()),
      },
      stakingMetrics: {
        totalValidators: stringToBn(counterForValidators.toString()),
        maxValidatorsCount: stringToBn(maxValidatorsCount.toString()),
        validatorCount: stringToBn(validatorCount.toString()),
        lastReward: stringToBn(prevErasValidatorReward.toString()),
        lastTotalStake: stringToBn(prevEraErasTotalStake.toString()),
        minNominatorBond: stringToBn(minNominatorBond.toString()),
        totalStaked: stringToBn(activeEraErasTotalStake.toString()),
        counterForNominators: stringToBn(counterForNominators.toString()),
      },
    };
  }
}
