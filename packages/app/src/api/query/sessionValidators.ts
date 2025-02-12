// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class SessionValidators extends Base {
  constructor(network: ChainId) {
    super(network)
  }

  // Fetch network constants.
  async fetch() {
    try {
      const result = await this.unsafeApi.query.Session.Validators.getValue({
        at: 'best',
      })
      return result
    } catch (e) {
      // Silently fail.
    }
    return []
  }
}
