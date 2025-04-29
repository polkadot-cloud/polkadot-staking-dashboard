// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import { BehaviorSubject } from 'rxjs'

export const _activeAddress = new BehaviorSubject<MaybeString>(null)
