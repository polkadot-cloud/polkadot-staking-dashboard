// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { APIActiveEra } from 'contexts/Api/types';
import { perbillToPercent, stringToBn } from 'library/Utils';
import type { PapiApi } from 'model/Api/types';

export class NetworkMeta {
  #api: PapiApi;

  constructor(api: PapiApi) {
    this.#api = api;
  }

  // Fetch network constants.
  async fetch(activeEra: APIActiveEra, previousEra: BigNumber) {
    const at = { at: 'best' };
    const totalIssuance =
      await this.#api.query.Balances.TotalIssuance.getValue(at);

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
      this.#api.query.Auctions.AuctionCounter.getValue(at),
      this.#api.query.ParaSessionInfo.EarliestStoredSession.getValue(at),
      this.#api.query.FastUnstake.ErasToCheckPerBlock.getValue(at),
      this.#api.query.Staking.MinimumActiveStake.getValue(at),
      this.#api.query.NominationPools.CounterForPoolMembers.getValue(at),
      this.#api.query.NominationPools.CounterForBondedPools.getValue(at),
      this.#api.query.NominationPools.CounterForRewardPools.getValue(at),
      this.#api.query.NominationPools.LastPoolId.getValue(at),
      this.#api.query.NominationPools.MaxPoolMembers.getValue(at),
      this.#api.query.NominationPools.MaxPoolMembersPerPool.getValue(at),
      this.#api.query.NominationPools.MaxPools.getValue(at),
      this.#api.query.NominationPools.MinCreateBond.getValue(at),
      this.#api.query.NominationPools.MinJoinBond.getValue(at),
      this.#api.query.NominationPools.GlobalMaxCommission.getValue(at),
      this.#api.query.Staking.CounterForNominators.getValue(at),
      this.#api.query.Staking.CounterForValidators.getValue(at),
      this.#api.query.Staking.MaxValidatorsCount.getValue(at),
      this.#api.query.Staking.ValidatorCount.getValue(at),
      this.#api.query.Staking.ErasValidatorReward.getValue(
        previousEra.toNumber(),
        at
      ),
      this.#api.query.Staking.ErasTotalStake.getValue(
        previousEra.toNumber(),
        at
      ),
      this.#api.query.Staking.MinNominatorBond.getValue(at),
      this.#api.query.Staking.ErasTotalStake.getValue(
        activeEra.index.toNumber(),
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
        maxValidatorsCount: stringToBn(maxValidatorsCount?.toString() || '0'),
        validatorCount: stringToBn(validatorCount.toString()),
        lastReward: stringToBn(prevErasValidatorReward?.toString() || '0'),
        lastTotalStake: stringToBn(prevEraErasTotalStake.toString()),
        minNominatorBond: stringToBn(minNominatorBond.toString()),
        totalStaked: stringToBn(activeEraErasTotalStake.toString()),
        counterForNominators: stringToBn(counterForNominators.toString()),
      },
    };
  }
}
