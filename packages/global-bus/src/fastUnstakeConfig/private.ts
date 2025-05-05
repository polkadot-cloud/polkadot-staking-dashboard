// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { FastUnstakeConfig } from 'types'
import { defaultFastUnstakeConfig } from './default'

export const _fastUnstakeConfig = new BehaviorSubject<FastUnstakeConfig>(
  defaultFastUnstakeConfig
)
