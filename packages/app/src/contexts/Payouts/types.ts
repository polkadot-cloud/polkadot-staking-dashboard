// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { UnclaimedRewards } from 'plugin-staking-api/types'

export interface PayoutsContextInterface {
  unclaimedRewards: UnclaimedRewards
  setUnclaimedRewards: (unclaimedRewards: UnclaimedRewards) => void
}
