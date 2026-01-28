// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { PoolWarningsState } from '.'
import { defaultPoolWarnings } from './default'

export const _poolWarnings = new BehaviorSubject<PoolWarningsState>(
	defaultPoolWarnings,
)
