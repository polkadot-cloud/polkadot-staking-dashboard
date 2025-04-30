// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeString } from '@w3ux/types'
import { _activeAddress } from './private'

export const activeAddress$ = _activeAddress.asObservable()

export const resetActiveAddress = () => {
  _activeAddress.next(null)
}

export const getActiveAddress$ = () => _activeAddress.getValue()

export const setActiveAddress = (address: MaybeString) => {
  _activeAddress.next(address)
}
