// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { PayeeSubmit } from 'contexts/Setup/types'
import type { ChainId } from 'types'

export class NewNominator extends Base {
  #payee: PayeeSubmit
  #bond: bigint
  #nominees: { type: string; value: string }[]

  constructor(
    network: ChainId,
    bond: bigint,
    payee: PayeeSubmit,
    nominees: { type: string; value: string }[]
  ) {
    super(network)
    this.#bond = bond
    this.#payee = payee
    this.#nominees = nominees
  }

  tx() {
    try {
      return [
        this.unsafeApi.tx.Staking.bond({
          value: this.#bond,
          payee: this.#payee,
        }),
        this.unsafeApi.tx.Staking.nominate({
          targets: this.#nominees,
        }),
      ]
    } catch (e) {
      return null
    }
  }
}
