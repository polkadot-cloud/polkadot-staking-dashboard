// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import BigNumber from 'bignumber.js';
import type { AnyApi } from 'types';

export class ActiveEra {
  // Fetch network constants.
  async fetch(api: ApiPromise) {
    // Fetch the active era.
    const result = JSON.parse(
      ((await api.query.staking.activeEra()) as AnyApi)
        .unwrapOrDefault()
        .toString()
    );

    // Store active era.
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
