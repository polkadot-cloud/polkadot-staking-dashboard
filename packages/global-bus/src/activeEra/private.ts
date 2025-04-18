// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { ActiveEra } from 'types'

export const _activeEra = new BehaviorSubject<ActiveEra>({
  index: 0,
  start: 0n,
})
