// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class ValidatorPrefs extends Base {
  #era: number;
  #address: string;

  constructor(client: PolkadotClient, era: number, address: string) {
    super(client);
    this.#era = era;
    this.#address = address;
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.query.Staking.ErasValidatorPrefs.getValue(
          this.#era,
          this.#address,
          { at: 'best' }
        );
      return result;
    } catch (e) {
      // Silently fail.
    }

    return undefined;
  }
}
