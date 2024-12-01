// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';
import type { ClaimPermission } from 'contexts/Pools/types';
import { defaultClaimPermission } from 'controllers/ActivePools/defaults';

export class JoinPool extends Base {
  #poolId: number;
  #bond: bigint;
  #claimPermission: ClaimPermission;

  constructor(
    network: ChainId,
    poolId: number,
    bond: bigint,
    claimPermission: ClaimPermission
  ) {
    super(network);
    this.#poolId = poolId;
    this.#bond = bond;
    this.#claimPermission = claimPermission;
  }

  tx() {
    try {
      const txs = [
        this.unsafeApi.tx.NominationPools.join({
          amount: this.#bond,
          pool_id: this.#poolId,
        }),
      ];

      if (this.#claimPermission !== defaultClaimPermission) {
        txs.push(
          this.unsafeApi.tx.NominationPools.set_claim_permission({
            permission: { type: this.#claimPermission, value: undefined },
          })
        );
      }

      if (txs.length === 1) {
        return txs[0];
      }
      return txs;
    } catch (e) {
      return null;
    }
  }
}
