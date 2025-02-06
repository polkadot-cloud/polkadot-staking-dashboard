// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class NominatorsMulti extends Base {
  #addresses: [string][]

  constructor(network: ChainId, addresses: [string][]) {
    super(network)
    this.#addresses = addresses
  }

  async fetch() {
    let result
    try {
      result = await this.unsafeApi.query.Staking.Nominators.getValues(
        this.#addresses,
        { at: 'best' }
      )

      return result.map((nominator) => {
        if (!nominator) {
          return undefined
        }
        return {
          submittedIn: String(nominator.submitted_in),
          suppressed: nominator.suppressed,
          targets: nominator.targets,
        }
      })
    } catch (e) {
      // Silently fail.
    }

    return null
  }
}
