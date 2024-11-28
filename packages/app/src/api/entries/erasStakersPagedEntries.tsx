// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class ErasStakersPagedEntries extends Base {
  constructor(client: PolkadotClient) {
    super(client);
  }

  async fetch(era: number, validator: string) {
    return await this.unsafeApi.query.Staking.ErasStakersPaged.getEntries(
      era,
      validator,
      { at: 'best' }
    );
  }
}
