// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';

export class PoolClaimPayout extends Base {
  constructor(network: ChainId) {
    super(network);
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.claim_payout();
    } catch (e) {
      return null;
    }
  }
}
