// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ValidatorFilterContextInterface } from './types';

export const defaultContext: ValidatorFilterContextInterface = {
  // eslint-disable-next-line
  orderValidators: (v) => {},
  // eslint-disable-next-line
  applyValidatorOrder: (l, o) => {},
  // eslint-disable-next-line
  applyValidatorFilters: (l, k, f) => {},
  // eslint-disable-next-line
  toggleFilterValidators: (v) => {},
  // eslint-disable-next-line
  toggleAllValidatorFilters: (t) => {},
  resetValidatorFilters: () => {},
  // eslint-disable-next-line
  validatorSearchFilter: (l, k, v) => {},
  validatorFilters: [],
  validatorOrder: 'default',
};
