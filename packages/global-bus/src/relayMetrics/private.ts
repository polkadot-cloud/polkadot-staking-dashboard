// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { BehaviorSubject } from 'rxjs'
import type { RelayMetrics } from 'types'
import { defaultRelayMetrics } from './default'

export const _relayMetrics = new BehaviorSubject<RelayMetrics>(
  defaultRelayMetrics
)
