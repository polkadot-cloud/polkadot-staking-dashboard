// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RelayMetrics } from 'types'
import { defaultRelayMetrics } from './default'
import { _relayMetrics } from './private'

export const relayMetrics$ = _relayMetrics.asObservable()

export const resetRelayMetrics = () => {
  _relayMetrics.next(defaultRelayMetrics)
}

export const getRelayMetrics = () => _relayMetrics.getValue()

export const setRelayMetrics = (metrics: RelayMetrics) => {
  _relayMetrics.next(metrics)
}

export * from './default'
