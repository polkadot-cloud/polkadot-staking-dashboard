// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { stringToU8a } from '@polkadot/util';
import { APIConstants } from 'types/api';
import BN from 'bn.js';

export const consts: APIConstants = {
  bondDuration: 0,
  maxNominations: 0,
  sessionsPerEra: 0,
  maxNominatorRewardedPerValidator: 0,
  maxElectingVoters: 0,
  expectedBlockTime: 0,
  existentialDeposit: new BN(0),
  poolsPalletId: stringToU8a('0'),
};
