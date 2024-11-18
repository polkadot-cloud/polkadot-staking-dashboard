// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActivePoolItem } from 'controllers/ActivePools/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import { combineLatest, type Subscription } from 'rxjs';
import type { NetworkName, SystemChainId } from 'types';

export class ActivePoolAccount implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName | SystemChainId;

  // Active subscription.
  #sub: Subscription;

  // Active pool item
  #pool: ActivePoolItem;

  constructor(network: NetworkName | SystemChainId, pool: ActivePoolItem) {
    this.#network = network;
    this.#pool = pool;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { pApi } = ApiController.get(this.#network);
      const bestOrFinalized = 'best';

      const sub = combineLatest([
        pApi.query.NominationPools.BondedPools.watchValue(
          this.#pool.id,
          bestOrFinalized
        ),
        pApi.query.NominationPools.RewardPools.watchValue(
          this.#pool.id,
          bestOrFinalized
        ),
        pApi.query.System.Account.watchValue(
          this.#pool.addresses.reward,
          bestOrFinalized
        ),
        pApi.query.Staking.Nominators.watchValue(
          this.#pool.addresses.stash,
          bestOrFinalized
        ),
      ]).subscribe(async ([bondedPool, rewardPool, account, nominators]) => {
        console.debug(bondedPool, rewardPool, account, nominators);

        // TODO: Implement callback.
      });

      this.#sub = sub;
    } catch (e) {
      // Subscription failed.
    }
  };

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#sub?.unsubscribe === 'function') {
      this.#sub.unsubscribe();
    }
  };
}
