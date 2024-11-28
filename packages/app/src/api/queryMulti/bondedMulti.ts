// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class BondedMulti extends Base {
  #addresses: [string][];

  constructor(client: PolkadotClient, eras: [string][]) {
    super(client);
    this.#addresses = eras;
  }

  async fetch() {
    try {
      const results = await this.unsafeApi.query.Staking.Bonded.getValues(
        this.#addresses,
        {
          at: 'best',
        }
      );
      return results;
    } catch (e) {
      // Silently fail.
    }

    return [];
  }
}
