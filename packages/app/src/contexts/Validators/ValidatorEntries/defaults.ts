// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js'
import type { ValidatorsContextInterface } from '../types'

export const defaultAverageEraValidatorReward = {
  days: 0,
  reward: new BigNumber(0),
}

export const defaultValidatorsContext: ValidatorsContextInterface = {
  fetchValidatorPrefs: async (a) => new Promise((resolve) => resolve(null)),
  injectValidatorListData: (entries) => [],
  getValidators: () => [],
  validatorIdentities: {},
  validatorSupers: {},
  avgCommission: 0,
  sessionValidators: [],
  sessionParaValidators: [],
  validatorsFetched: 'unsynced',
  averageEraValidatorReward: defaultAverageEraValidatorReward,
  formatWithPrefs: (addresses) => [],
  getValidatorTotalStake: (address) => 0n,
  activeValidatorRanks: [],
  getValidatorRankSegment: (address) => 0,
}

export const defaultValidatorsData = {
  entries: [],
  notFullCommissionCount: 0,
  totalNonAllCommission: new BigNumber(0),
}
