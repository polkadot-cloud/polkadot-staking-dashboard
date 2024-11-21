// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from 'model/Api/types';

export class NominatorsMulti {
  #pApi: PapiApi;

  #addresses: [string][];

  constructor(pApi: PapiApi, addresses: [string][]) {
    this.#pApi = pApi;
    this.#addresses = addresses;
  }

  async fetch() {
    let result;
    try {
      result = await this.#pApi.query.Staking.Nominators.getValues(
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
