// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class PayoutStakersByPage extends Base {
  #validator: string
  #era: number
  #page: number

  constructor(network: ChainId, validator: string, era: number, page: number) {
    super(network)
    this.#validator = validator
    this.#era = era
    this.#page = page
  }

  tx() {
    try {
      return this.unsafeApi.tx.Staking.payout_stakers_by_page({
        validator_stash: this.#validator,
        era: this.#era,
        page: this.#page,
      })
    } catch (e) {
      return null
    }
  }
}
