// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class NominatorsMulti {
  #api: PapiApi;

  #addresses: [string][];

  constructor(api: PapiApi, addresses: [string][]) {
    this.#api = api;
    this.#addresses = addresses;
  }

  async fetch() {
    let result;
    try {
      result = await this.#api.query.Staking.Nominators.getValues(
        this.#addresses,
        { at: 'best' }
      );

      return result.map((nominator) => {
        if (!nominator) {
          return undefined;
        }
        return {
          submittedIn: String(nominator.submitted_in),
          suppressed: nominator.suppressed,
          targets: nominator.targets,
        };
      });
    } catch (e) {
      // Silently fail.
    }

    return null;
  }
}
