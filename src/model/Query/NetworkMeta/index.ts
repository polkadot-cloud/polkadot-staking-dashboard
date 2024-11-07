// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import type { APIActiveEra } from 'contexts/Api/types';
import { stringToBn } from 'library/Utils';

export class NetworkMeta {
  // Fetch network constants.
  async fetch(
    api: ApiPromise,
    activeEra: APIActiveEra,
    previousEra: BigNumber
  ) {
    // Fetch network configuration.
    const networkMeta = await api.queryMulti([
      // Network metrics.
      api.query.balances.totalIssuance,
      api.query.auctions.auctionCounter,
      api.query.paraSessionInfo.earliestStoredSession,
      api.query.fastUnstake.erasToCheckPerBlock,
      api.query.staking.minimumActiveStake,
      // Nomination pool configs.
      api.query.nominationPools.counterForPoolMembers,
      api.query.nominationPools.counterForBondedPools,
      api.query.nominationPools.counterForRewardPools,
      api.query.nominationPools.lastPoolId,
      api.query.nominationPools.maxPoolMembers,
      api.query.nominationPools.maxPoolMembersPerPool,
      api.query.nominationPools.maxPools,
      api.query.nominationPools.minCreateBond,
      api.query.nominationPools.minJoinBond,
      api.query.nominationPools.globalMaxCommission,
      // Staking metrics.
      api.query.staking.counterForNominators,
      api.query.staking.counterForValidators,
      api.query.staking.maxValidatorsCount,
      api.query.staking.validatorCount,
      [api.query.staking.erasValidatorReward, previousEra.toString()],
      [api.query.staking.erasTotalStake, previousEra.toString()],
      api.query.staking.minNominatorBond,
      [api.query.staking.erasTotalStake, activeEra.index.toString()],
      api.query.staking.counterForNominators,
    ]);

    // format optional configs to BigNumber or null.
    const maxPoolMembers = networkMeta[9].toHuman()
      ? new BigNumber(rmCommas(networkMeta[9].toString()))
      : null;

    const maxPoolMembersPerPool = networkMeta[10].toHuman()
      ? new BigNumber(rmCommas(networkMeta[10].toString()))
      : null;

    const maxPools = networkMeta[11].toHuman()
      ? new BigNumber(rmCommas(networkMeta[11].toString()))
      : null;

    return {
      networkMetrics: {
        totalIssuance: new BigNumber(networkMeta[0].toString()),
        auctionCounter: new BigNumber(networkMeta[1].toString()),
        earliestStoredSession: new BigNumber(networkMeta[2].toString()),
        fastUnstakeErasToCheckPerBlock: Number(
          rmCommas(networkMeta[3].toString())
        ),
        minimumActiveStake: new BigNumber(networkMeta[4].toString()),
      },
      poolsConfig: {
        counterForPoolMembers: stringToBn(networkMeta[5].toString()),
        counterForBondedPools: stringToBn(networkMeta[6].toString()),
        counterForRewardPools: stringToBn(networkMeta[7].toString()),
        lastPoolId: stringToBn(networkMeta[8].toString()),
        maxPoolMembers,
        maxPoolMembersPerPool,
        maxPools,
        minCreateBond: stringToBn(networkMeta[12].toString()),
        minJoinBond: stringToBn(networkMeta[13].toString()),
        globalMaxCommission: Number(
          String(networkMeta[14]?.toHuman() || '100%').slice(0, -1)
        ),
      },
      stakingMetrics: {
        totalNominators: stringToBn(networkMeta[15].toString()),
        totalValidators: stringToBn(networkMeta[16].toString()),
        maxValidatorsCount: stringToBn(networkMeta[17].toString()),
        validatorCount: stringToBn(networkMeta[18].toString()),
        lastReward: stringToBn(networkMeta[19].toString()),
        lastTotalStake: stringToBn(networkMeta[20].toString()),
        minNominatorBond: stringToBn(networkMeta[21].toString()),
        totalStaked: stringToBn(networkMeta[22].toString()),
        counterForNominators: stringToBn(networkMeta[23].toString()),
      },
    };
  }
}
