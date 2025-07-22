// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ValidatorFilterContextInterface } from './types'

export const defaultContext: ValidatorFilterContextInterface = {
  orderValidators: (_v) => {},
  applyValidatorOrder: (_l, _o) => {},
  applyValidatorFilters: (_l, _k, _f) => {},
  toggleFilterValidators: (_v) => {},
  toggleAllValidatorFilters: (_t) => {},
  resetValidatorFilters: () => {},
  validatorSearchFilter: (_l, _k, _v) => {},
  validatorFilters: [],
  validatorOrder: 'default',
}
