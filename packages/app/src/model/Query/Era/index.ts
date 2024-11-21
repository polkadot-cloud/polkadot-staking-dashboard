// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { PapiApi } from 'model/Api/types';

export class Era {
  #pApi: PapiApi;

  constructor(pApi: PapiApi) {
    this.#pApi = pApi;
  }

  async fetch() {
    let result;
    try {
      const { index, start } =
        await this.#pApi.query.Staking.ActiveEra.getValue({
          at: 'best',
        });

      result = {
        start,
        index,
      };
    } catch (e) {
      result = {
        start: 0,
        index: 0,
      };
    }

    // Store active era as BigNumbers.
    const activeEra = {
      index: new BigNumber(result.index),
      start: new BigNumber(result.start),
    };

    // Get previous era.
    const previousEra = BigNumber.max(
      0,
      new BigNumber(activeEra.index).minus(1)
    );

    return {
      activeEra,
      previousEra,
    };
  }
}
