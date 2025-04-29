// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import { toU8a } from 'dedot/utils'
import type { StakingChain } from '../types'

export class StakingConsts<T extends StakingChain> {
  bondDuration: number
  sessionsPerEra: number
  maxExposurePageSize: number
  historyDepth: number
  fastUnstakeDeposit: bigint
  poolsPalletId: Uint8Array

  constructor(public api: DedotClient<T>) {
    this.api = api
    this.fetch()
  }

  fetch() {
    this.bondDuration = this.api.consts.staking.bondingDuration
    this.sessionsPerEra = this.api.consts.staking.sessionsPerEra
    this.maxExposurePageSize = this.api.consts.staking.maxExposurePageSize
    this.historyDepth = this.api.consts.staking.historyDepth
    this.fastUnstakeDeposit = this.api.consts.fastUnstake.deposit
    this.poolsPalletId = toU8a(this.api.consts.nominationPools.palletId)
  }

  get() {
    return {
      bondDuration: this.bondDuration,
      sessionsPerEra: this.sessionsPerEra,
      maxExposurePageSize: this.maxExposurePageSize,
      historyDepth: this.historyDepth,
      fastUnstakeDeposit: this.fastUnstakeDeposit,
      poolsPalletId: this.poolsPalletId,
    }
  }
}
