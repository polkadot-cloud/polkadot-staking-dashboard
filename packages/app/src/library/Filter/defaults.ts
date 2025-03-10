// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ValidatorFilterContextInterface } from './types'

export const defaultContext: ValidatorFilterContextInterface = {
  orderValidators: (v) => {},
  applyValidatorOrder: (l, o) => {},
  applyValidatorFilters: (l, k, f) => {},
  toggleFilterValidators: (v) => {},
  toggleAllValidatorFilters: (t) => {},
  resetValidatorFilters: () => {},
  validatorSearchFilter: (l, k, v) => {},
  validatorFilters: [],
  validatorOrder: 'default',
}
