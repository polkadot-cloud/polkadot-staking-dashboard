// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ValidatorFilterContextInterface } from './types';

export const defaultContext: ValidatorFilterContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orderValidators: (v) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyValidatorOrder: (l, o) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyValidatorFilters: (l, k, f) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleFilterValidators: (v, l) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleAllValidatorFilters: (t) => {},
  resetValidatorFilters: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validatorSearchFilter: (l, k, v) => {},
  validatorFilters: [],
  validatorOrder: 'default',
};
