// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { AnyApi, NetworkName } from 'types';
import type { AnyJson } from '@w3ux/types';

export class PoolMembers implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // Unsubscribe object.
  #unsub: VoidFn;

  // The associated key for this subscription.
  key: string;

  // The addresses being subscribed to.
  addresses: string[] = [];

  // Store the pool memberes of this subscription.
  pools: AnyJson;

  constructor(network: NetworkName, key: string, addresses: string[]) {
    this.#network = network;
    this.addresses = addresses;
    this.key = key;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { api } = ApiController.get(this.#network);

      if (api && this.#unsub === undefined) {
        const unsub = await api.query.nominationPools.poolMembers.multi<AnyApi>(
          this.addresses,
          (_pools) => {
            // Store subscription state.
            this.pools = _pools.map((pool) => pool.toHuman());

            // Send subscription data to UI.
            document.dispatchEvent(
              new CustomEvent('new-pool-members', {
                detail: {
                  network: this.#network,
                  key: this.key,
                  pools: this.pools,
                },
              })
            );
          }
        );

        // Subscription now initialised. Store unsub.
        this.#unsub = unsub as unknown as VoidFn;
      }
    } catch (e) {
      // Silently fail.
    }
  };

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      this.#unsub();
    }
  };
}
