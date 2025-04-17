// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base'
import type { ChainId } from 'types'

export class ErasStakersPagedEntries extends Base {
  constructor(network: ChainId) {
    super(network)
  }

  async fetch(era: number, validator: string) {
    return await this.unsafeApi.query.Staking.ErasStakersPaged.getEntries(
      era,
      validator,
      { at: 'best' }
    )
  }
}
