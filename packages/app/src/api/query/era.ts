// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import BigNumber from 'bignumber.js';
import type { ChainId } from 'common-types';

export class Era extends Base {
  constructor(network: ChainId) {
    super(network);
  }

  async fetch() {
    let era = {
      start: 0n,
      index: 0,
    };

    try {
      const result = await this.unsafeApi.query.Staking.ActiveEra.getValue({
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
