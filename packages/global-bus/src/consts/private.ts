// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { ChainConsts } from 'types'

export const _consts = new BehaviorSubject<Record<string, ChainConsts>>({})
