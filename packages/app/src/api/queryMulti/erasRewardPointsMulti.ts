// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class ErasRewardPointsMulti extends Base {
  #eras: [number][];

  constructor(client: PolkadotClient, eras: [number][]) {
    super(client);
    this.#eras = eras;
  }

  async fetch() {
    try {
      const results =
        await this.unsafeApi.query.Staking.ErasRewardPoints.getValues(
          this.#eras,
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
