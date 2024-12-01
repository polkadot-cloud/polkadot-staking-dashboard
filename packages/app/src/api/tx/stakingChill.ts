// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';

export class StakingChill extends Base {
  constructor(network: ChainId) {
    super(network);
  }

  tx() {
    try {
      return this.unsafeApi.tx.Staking.chill();
    } catch (e) {
      return null;
    }
  }
}
