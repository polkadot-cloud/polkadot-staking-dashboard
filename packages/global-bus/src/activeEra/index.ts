// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveEra } from 'types'
import { _activeEra } from './private'

export const activeEra$ = _activeEra.asObservable()

export const resetActiveEra = () => {
  _activeEra.next({
    index: 0,
    start: 0n,
  })
}

export const getActiveEra = () => _activeEra.getValue()

export const setActiveEra = (activeEra: ActiveEra) => {
  _activeEra.next(activeEra)
}
