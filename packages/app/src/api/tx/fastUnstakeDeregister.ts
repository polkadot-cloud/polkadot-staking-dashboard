// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'types';

export class FastUnstakeDeregister extends Base {
  constructor(network: ChainId) {
    super(network);
  }

  tx() {
    try {
      return this.unsafeApi.tx.FastUnstake.deregister();
    } catch (e) {
      return null;
    }
  }
}
