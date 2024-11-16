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
    const totalIssuance =
      await this.#pApi.query.Balances.TotalIssuance.getValue();

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
      this.#pApi.query.Auctions.AuctionCounter.getValue(),
      this.#pApi.query.ParaSessionInfo.EarliestStoredSession.getValue(),
      this.#pApi.query.FastUnstake.ErasToCheckPerBlock.getValue(),
      this.#pApi.query.Staking.MinimumActiveStake.getValue(),
      this.#pApi.query.NominationPools.CounterForPoolMembers.getValue(),
      this.#pApi.query.NominationPools.CounterForBondedPools.getValue(),
      this.#pApi.query.NominationPools.CounterForRewardPools.getValue(),
      this.#pApi.query.NominationPools.LastPoolId.getValue(),
      this.#pApi.query.NominationPools.MaxPoolMembers.getValue(),
      this.#pApi.query.NominationPools.MaxPoolMembersPerPool.getValue(),
      this.#pApi.query.NominationPools.MaxPools.getValue(),
      this.#pApi.query.NominationPools.MinCreateBond.getValue(),
      this.#pApi.query.NominationPools.MinJoinBond.getValue(),
      this.#pApi.query.NominationPools.GlobalMaxCommission.getValue(),
      this.#pApi.query.Staking.CounterForNominators.getValue(),
      this.#pApi.query.Staking.CounterForValidators.getValue(),
      this.#pApi.query.Staking.MaxValidatorsCount.getValue(),
      this.#pApi.query.Staking.ValidatorCount.getValue(),
      this.#pApi.query.Staking.ErasValidatorReward.getValue(
        previousEra.toString()
      ),
      this.#pApi.query.Staking.ErasTotalStake.getValue(previousEra.toString()),
      this.#pApi.query.Staking.MinNominatorBond.getValue(),
      this.#pApi.query.Staking.ErasTotalStake.getValue(
        activeEra.index.toString()
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
