// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import { NetworkList } from 'config/networks';
import { stringToBn } from 'library/Utils';

export class StakingConstants {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Network config fallback values.
  FALLBACK = {
    MAX_NOMINATIONS: new BigNumber(16),
    BONDING_DURATION: new BigNumber(28),
    SESSIONS_PER_ERA: new BigNumber(6),
    MAX_ELECTING_VOTERS: new BigNumber(22500),
    EXPECTED_BLOCK_TIME: new BigNumber(6000),
    EPOCH_DURATION: new BigNumber(2400),
  };

  // Fetch network constants.
  async fetch(api: ApiPromise, network: string) {
    const allPromises = [
      api.consts.staking.bondingDuration,
      api.consts.staking.maxNominations,
      api.consts.staking.sessionsPerEra,
      api.consts.electionProviderMultiPhase.maxElectingVoters,
      api.consts.babe.expectedBlockTime,
      api.consts.babe.epochDuration,
      api.consts.balances.existentialDeposit,
      api.consts.staking.historyDepth,
      api.consts.fastUnstake.deposit,
      api.consts.nominationPools.palletId,
      api.consts.staking.maxExposurePageSize,
    ];

    const consts = await Promise.all(allPromises);

    return {
      bondDuration: consts[0]
        ? stringToBn(consts[0].toString())
        : this.FALLBACK.BONDING_DURATION,
      maxNominations: consts[1]
        ? stringToBn(consts[1].toString())
        : this.FALLBACK.MAX_NOMINATIONS,
      sessionsPerEra: consts[2]
        ? stringToBn(consts[2].toString())
        : this.FALLBACK.SESSIONS_PER_ERA,
      maxElectingVoters: consts[3]
        ? stringToBn(consts[3].toString())
        : this.FALLBACK.MAX_ELECTING_VOTERS,
      expectedBlockTime: consts[4]
        ? stringToBn(consts[4].toString())
        : this.FALLBACK.EXPECTED_BLOCK_TIME,
      epochDuration: consts[5]
        ? stringToBn(consts[5].toString())
        : this.FALLBACK.EPOCH_DURATION,
      existentialDeposit: consts[6]
        ? stringToBn(consts[6].toString())
        : new BigNumber(0),
      historyDepth: consts[7]
        ? stringToBn(consts[7].toString())
        : new BigNumber(0),
      fastUnstakeDeposit: consts[8]
        ? stringToBn(consts[8].toString())
        : new BigNumber(0),
      poolsPalletId: consts[9] ? consts[9].toU8a() : new Uint8Array(0),
      maxExposurePageSize: consts[10]
        ? stringToBn(consts[10].toString())
        : NetworkList[network].maxExposurePageSize,
    };
  }
}
