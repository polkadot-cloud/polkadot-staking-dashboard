// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { RelayChain } from '../types'

export class CoreConsts<T extends RelayChain> {
  expectedBlockTime: bigint
  epochDuration: bigint

  constructor(public api: DedotClient<T>) {
    this.api = api
    this.fetch()
  }

  fetch() {
    this.expectedBlockTime = this.api.consts.babe.expectedBlockTime
    this.epochDuration = this.api.consts.babe.epochDuration
  }
}
