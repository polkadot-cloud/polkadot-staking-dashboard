// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import { toU8a } from 'dedot/utils'
import type { StakingChainType } from '../types'

export class StakingConsts<T extends StakingChainType> {
  bondDuration: number
  sessionsPerEra: number
  maxExposurePageSize: number
  historyDepth: number
  poolsPalletId: Uint8Array

  constructor(public api: DedotClient<T>) {
    this.api = api
  }

  get() {
    this.bondDuration = this.api.consts.staking.bondingDuration
    this.sessionsPerEra = this.api.consts.staking.sessionsPerEra
    this.maxExposurePageSize = this.api.consts.staking.maxExposurePageSize
    this.historyDepth = this.api.consts.staking.historyDepth
    this.poolsPalletId = toU8a(this.api.consts.nominationPools.palletId)
  }
}
