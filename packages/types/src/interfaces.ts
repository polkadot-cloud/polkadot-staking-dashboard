// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PalletStakingEraRewardPoints } from 'dedot/chaintypes'

export interface ServiceInterface {
  query: {
    eraRewardPoints: (era: number) => Promise<PalletStakingEraRewardPoints>
  }
}
