// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { ChainId } from 'common-types';
import type { PoolRoles } from 'types';

export class PoolUpdateRoles extends Base {
  #poolId: number;
  #roles: PoolRoles;

  constructor(network: ChainId, poolId: number, roles: PoolRoles) {
    super(network);
    this.#poolId = poolId;
    this.#roles = roles;
  }

  tx() {
    try {
      return this.unsafeApi.tx.NominationPools.update_roles({
        pool_id: this.#poolId,
        new_root: this.#roles.root
          ? { type: 'Set', value: this.#roles.root }
          : { type: 'Remove', value: undefined },

        new_nominator: this.#roles.nominator
          ? { type: 'Set', value: this.#roles.nominator }
          : { type: 'Remove', value: undefined },

        new_bouncer: this.#roles.bouncer
          ? { type: 'Set', value: this.#roles.bouncer }
          : { type: 'Remove', value: undefined },
      });
    } catch (e) {
      return null;
    }
  }
}
