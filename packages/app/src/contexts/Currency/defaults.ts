// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { CurrencyContextInterface } from './types'

export const defaultCurrencyContext: CurrencyContextInterface = {
  currency: 'USD',
  setCurrency: (currency) => {},
}
