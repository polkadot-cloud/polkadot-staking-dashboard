// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { PoolsConfig } from 'types'
import { defaultPoolsConfig } from './default'

export const _poolsConfig = new BehaviorSubject<PoolsConfig>(defaultPoolsConfig)
