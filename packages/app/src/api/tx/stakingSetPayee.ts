// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { PayeeSubmit } from 'contexts/Setup/types'
import type { ChainId } from 'types'

export class StakingSetPayee extends Base {
  #payee: PayeeSubmit

  constructor(network: ChainId, payee: PayeeSubmit) {
    super(network)
    this.#payee = payee
  }

  tx() {
    try {
      return this.unsafeApi.tx.Staking.set_payee({
        payee: this.#payee,
      })
    } catch (e) {
      return null
    }
  }
}
