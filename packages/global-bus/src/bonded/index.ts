// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Bonded } from 'types'
import { _bonded } from './private'

export const bonded$ = _bonded.asObservable()

export const resetBonded = () => {
  _bonded.next({})
}

export const getBonded = (address: string): Bonded =>
  _bonded.getValue()?.[address]

export const setBonded = (address: string, value: Bonded) => {
  const next = { ..._bonded.getValue() }
  next[address] = value
  _bonded.next(next)
}

export const removeBonded = (address: string) => {
  const next = { ..._bonded.getValue() }
  delete next[address]
  _bonded.next(next)
}
