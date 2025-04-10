// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class ValidatorPrefs extends Base {
  #era: number
  #address: string

  constructor(network: ChainId, era: number, address: string) {
    super(network)
    this.#era = era
    this.#address = address
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.query.Staking.ErasValidatorPrefs.getValue(
          this.#era,
          this.#address,
          { at: 'best' }
        )
      return result
    } catch (e) {
      // Silently fail.
    }

    return undefined
  }
}
