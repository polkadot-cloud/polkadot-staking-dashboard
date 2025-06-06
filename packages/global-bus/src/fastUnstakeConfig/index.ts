// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FastUnstakeConfig } from 'types'
import { defaultFastUnstakeConfig } from './default'
import { _fastUnstakeConfig } from './private'

export const fastUnstakeConfig$ = _fastUnstakeConfig.asObservable()

export const resetFastUnstakeConfig = () => {
  _fastUnstakeConfig.next(defaultFastUnstakeConfig)
}

export const getFastUnstakeConfig = () => _fastUnstakeConfig.getValue()

export const setFastUnstakeConfig = (value: FastUnstakeConfig) => {
  _fastUnstakeConfig.next(value)
}

export * from './default'
