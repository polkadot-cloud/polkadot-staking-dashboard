// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class PoolBondExtra extends Base {
  #type: 'FreeBalance' | 'Rewards'
  #bond: bigint

  constructor(
    network: ChainId,
    type: 'FreeBalance' | 'Rewards',
    bond?: bigint
  ) {
    super(network)
    this.#type = type
    this.#bond = bond || 0n
  }

  tx() {
    try {
      const extra =
        this.#type === 'FreeBalance'
          ? {
              type: this.#type,
              value: this.#bond,
            }
          : { type: 'Rewards', value: undefined }

      return this.unsafeApi.tx.NominationPools.bond_extra({
        extra,
      })
    } catch (e) {
      return null
    }
  }
}
