// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { CurencyContextInterface } from './types'

export const defaultCurrencyContext: CurencyContextInterface = {
  currency: 'USD',
  setCurrency: (currency) => {},
}
