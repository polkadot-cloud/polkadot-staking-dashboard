// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { _blockNumber } from './private'

export const blockNumber$ = _blockNumber.asObservable()

export const resetBlockNumber = () => {
  _blockNumber.next(0)
}

export const getBlockNumber = () => _blockNumber.getValue()

export const setBlockNumber = (number: number) => {
  _blockNumber.next(number)
}
