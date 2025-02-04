// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'common-types'

export class ErasStakersOverview extends Base {
  constructor(network: ChainId) {
    super(network)
  }

  async fetch(era: number) {
    return await this.unsafeApi.query.Staking.ErasStakersOverview.getEntries(
      era,
      {
        at: 'best',
      }
    )
  }
}
