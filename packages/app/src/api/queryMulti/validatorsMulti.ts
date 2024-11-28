// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class ValidatorsMulti extends Base {
  #addresses: [string][];

  constructor(client: PolkadotClient, addresses: [string][]) {
    super(client);
    this.#addresses = addresses;
  }

  async fetch() {
    try {
      const result = await this.unsafeApi.query.Staking.Validators.getValues(
        this.#addresses,
        { at: 'best' }
      );
      return result;
    } catch (e) {
      // Silently fail.
    }

    return null;
  }
}
