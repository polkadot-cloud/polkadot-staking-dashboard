// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { EraPointsBoundaries, ValidatorsContextInterface } from '../types';

export const defaultAverageEraValidatorReward = {
  days: 0,
  reward: new BigNumber(0),
};

export const defaultValidatorsContext: ValidatorsContextInterface = {
  fetchValidatorPrefs: async (a) => new Promise((resolve) => resolve(null)),
  getValidatorPointsFromEras: (startEra, address) => ({}),
  getNominated: (bondFor) => [],
  injectValidatorListData: (entries) => [],
  validators: [],
  validatorIdentities: {},
  validatorSupers: {},
  avgCommission: 0,
  sessionValidators: [],
  sessionParaValidators: [],
  nominated: null,
  poolNominated: null,
  validatorCommunity: [],
  erasRewardPoints: {},
  validatorsFetched: 'unsynced',
  eraPointsBoundaries: null,
  validatorEraPointsHistory: {},
  erasRewardPointsFetched: 'unsynced',
  averageEraValidatorReward: defaultAverageEraValidatorReward,
};

export const defaultValidatorsData = {
  entries: [],
  notFullCommissionCount: 0,
  totalNonAllCommission: new BigNumber(0),
};

export const defaultEraPointsBoundaries: EraPointsBoundaries = null;
