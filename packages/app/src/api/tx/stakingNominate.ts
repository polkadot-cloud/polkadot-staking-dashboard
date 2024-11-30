// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'types';

export class StakingNominate extends Base {
  #nominees: { type: string; value: string }[];

  constructor(network: ChainId, nominees: { type: string; value: string }[]) {
    super(network);
    this.#nominees = nominees;
  }

  tx() {
    try {
      return this.unsafeApi.tx.Staking.nominate({
        validators: this.#nominees,
      });
    } catch (e) {
      return null;
    }
  }
}
