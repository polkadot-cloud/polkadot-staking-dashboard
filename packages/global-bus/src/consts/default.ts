// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainConsts } from 'types'

export const defaultConsts: ChainConsts = {
  bondDuration: 0,
  sessionsPerEra: 0,
  maxExposurePageSize: 0,
  historyDepth: 0,
  expectedBlockTime: 0n,
  epochDuration: 0n,
  fastUnstakeDeposit: 0n,
  poolsPalletId: new Uint8Array([0]),
}
