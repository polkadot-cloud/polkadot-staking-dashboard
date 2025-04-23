// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PalletStakingEraRewardPoints } from 'dedot/chaintypes'
import { BehaviorSubject } from 'rxjs'
import { defaultEraRewardPoints } from './default'

export const _eraRewardPoints =
  new BehaviorSubject<PalletStakingEraRewardPoints>(defaultEraRewardPoints)
