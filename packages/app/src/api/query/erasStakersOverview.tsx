// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class ErasStakersOverview extends Base {
  constructor(client: PolkadotClient) {
    super(client);
  }

  async fetch(era: number) {
    return await this.unsafeApi.query.Staking.ErasStakersOverview.getEntries(
      era,
      {
        at: 'best',
      }
    );
  }
}
