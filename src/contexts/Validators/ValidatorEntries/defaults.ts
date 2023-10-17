// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { ValidatorsContextInterface } from '../types';

export const defaultValidatorsData = {
  entries: [],
  notFullCommissionCount: 0,
  totalNonAllCommission: new BigNumber(0),
};

export const defaultValidatorsContext: ValidatorsContextInterface = {
  fetchValidatorPrefs: async (a) => new Promise((resolve) => resolve(null)),
  validators: [],
  validatorIdentities: {},
  validatorSupers: {},
  avgCommission: 0,
  sessionValidators: [],
  sessionParaValidators: [],
  nominated: null,
  poolNominated: null,
  validatorCommunity: [],
  validatorsFetched: 'unsynced',
};
