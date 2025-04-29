// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FastUnstakeQueue } from 'types'
import { _fastUnstakeQueue } from './private'

export const fastUnstakeQueue$ = _fastUnstakeQueue.asObservable()

export const resetFastUnstakeQueue = () => {
  _fastUnstakeQueue.next(undefined)
}

export const getFastUnstakeQueue = () => _fastUnstakeQueue.getValue()

export const setFastUnstakeQueue = (value: FastUnstakeQueue) => {
  _fastUnstakeQueue.next(value)
}
