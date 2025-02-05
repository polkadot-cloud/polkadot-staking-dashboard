// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import type { PayoutsContextInterface } from './types'

export const defaultUnclaimedRewards = {
  total: '0',
  entries: [],
}

export const defaultPayoutsContext: PayoutsContextInterface = {
  unclaimedRewards: defaultUnclaimedRewards,
  setUnclaimedRewards: (unclaimedRewards) => {},
}
