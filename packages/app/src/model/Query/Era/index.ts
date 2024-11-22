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
    let era = {
      start: 0n,
      index: 0,
    };

    try {
      const result = await this.#pApi.query.Staking.ActiveEra.getValue({
        at: 'best',
      });

      if (result) {
        era = {
          start: result?.start || 0n,
          index: result.index,
        };
      }
    } catch (e) {
      // Silent fail.
    }

    // Store active era as BigNumbers.
    const activeEra = {
      start: new BigNumber(era.start.toString()),
      index: new BigNumber(era.index),
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
