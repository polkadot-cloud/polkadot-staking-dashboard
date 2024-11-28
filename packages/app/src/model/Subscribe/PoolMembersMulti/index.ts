// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Apis } from 'controllers/Apis';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import { combineLatest, type Subscription } from 'rxjs';
import type { AnyApi, NetworkName } from 'types';
import type { PoolMemberBatchEvent } from './types';

export class PoolMembersMulti implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // The batch key.
  #key: string;
  #addresses: string[];
  result: AnyApi;

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkName, key: string, addresses: string[]) {
    this.#network = network;
    this.#key = key;
    this.#addresses = addresses;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network);
      if (api && this.#sub === undefined) {
        const bestOrFinalized = 'best';

        const sub = combineLatest(
          this.#addresses.map((address) =>
            api.query.NominationPools.PoolMembers.watchValue(
              address,
              bestOrFinalized
            )
          )
        ).subscribe((results) => {
          const formatted = results
            .map((result) => {
              if (!result) {
                return undefined;
              }

              return {
                lastRecordedRewardCounter:
                  result.last_recorded_reward_counter.toString(),
                points: result.points.toString(),
                poolId: result.pool_id.toString(),
                unbondingEras: Object.fromEntries(
                  result.unbonding_eras.map(
                    ([key, value]: [number, bigint]) => [
                      key.toString(),
                      value.toString(),
                    ]
                  )
                ),
              };
            })
            .filter((result) => result !== undefined);

          const detail: PoolMemberBatchEvent = {
            key: this.#key,
            addresses: this.#addresses,
            poolMembers: formatted,
          };

          document.dispatchEvent(
            new CustomEvent('new-pool-members-batch', {
              detail,
            })
          );
        });

        this.#sub = sub;
      }
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
