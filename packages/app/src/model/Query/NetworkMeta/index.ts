// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { APIActiveEra } from 'contexts/Api/types';
import { perbillToPercent, stringToBn } from 'library/Utils';
import type { PapiApi } from 'model/Api/types';

export class NetworkMeta {
  #pApi: PapiApi;

  constructor(pApi: PapiApi) {
    this.#pApi = pApi;
  }

  // Fetch network constants.
  async fetch(activeEra: APIActiveEra, previousEra: BigNumber) {
    const at = { at: 'best' };
    const totalIssuance =
      await this.#pApi.query.Balances.TotalIssuance.getValue(at);

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
      this.#pApi.query.Auctions.AuctionCounter.getValue(at),
      this.#pApi.query.ParaSessionInfo.EarliestStoredSession.getValue(at),
      this.#pApi.query.FastUnstake.ErasToCheckPerBlock.getValue(at),
      this.#pApi.query.Staking.MinimumActiveStake.getValue(at),
      this.#pApi.query.NominationPools.CounterForPoolMembers.getValue(at),
      this.#pApi.query.NominationPools.CounterForBondedPools.getValue(at),
      this.#pApi.query.NominationPools.CounterForRewardPools.getValue(at),
      this.#pApi.query.NominationPools.LastPoolId.getValue(at),
      this.#pApi.query.NominationPools.MaxPoolMembers.getValue(at),
      this.#pApi.query.NominationPools.MaxPoolMembersPerPool.getValue(at),
      this.#pApi.query.NominationPools.MaxPools.getValue(at),
      this.#pApi.query.NominationPools.MinCreateBond.getValue(at),
      this.#pApi.query.NominationPools.MinJoinBond.getValue(at),
      this.#pApi.query.NominationPools.GlobalMaxCommission.getValue(at),
      this.#pApi.query.Staking.CounterForNominators.getValue(at),
      this.#pApi.query.Staking.CounterForValidators.getValue(at),
      this.#pApi.query.Staking.MaxValidatorsCount.getValue(at),
      this.#pApi.query.Staking.ValidatorCount.getValue(at),
      this.#pApi.query.Staking.ErasValidatorReward.getValue(
        previousEra.toString(),
        at
      ),
      this.#pApi.query.Staking.ErasTotalStake.getValue(
        previousEra.toString(),
        at
      ),
      this.#pApi.query.Staking.MinNominatorBond.getValue(at),
      this.#pApi.query.Staking.ErasTotalStake.getValue(
        activeEra.index.toString(),
        at
      ),
    ]);

    // Format globalMaxCommission from a perbill to a percent.
    const globalMaxCommissionAsPercent = !globalMaxCommission
      ? new BigNumber(0)
      : perbillToPercent(globalMaxCommission);

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
