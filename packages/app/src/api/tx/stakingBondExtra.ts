// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class StakingBondExtra extends Base {
  #bond: bigint

  constructor(network: ChainId, bond: bigint) {
    super(network)
    this.#bond = bond
  }

  tx() {
    try {
      return this.unsafeApi.tx.Staking.bond_extra({
        max_additional: this.#bond,
      })
    } catch (e) {
      return null
    }
  }
}
