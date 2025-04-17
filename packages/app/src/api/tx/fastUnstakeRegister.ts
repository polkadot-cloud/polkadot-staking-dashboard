// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class FastUnstakeRegister extends Base {
  constructor(network: ChainId) {
    super(network)
  }

  tx() {
    try {
      return this.unsafeApi.tx.FastUnstake.register_fast_unstake()
    } catch (e) {
      return null
    }
  }
}
