// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import type { NetworkName } from 'types';

export class FastUnstakeQueue implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // The depositor address.
  #address: string;

  // The deposit.
  queue: bigint;

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkName, address: string) {
    this.#network = network;
    this.#address = address;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { pApi } = ApiController.get(this.#network);

      if (pApi && this.#sub === undefined) {
        const bestOrFinalized = 'best';
        const unsub = pApi.query.FastUnstake.Queue.watchValue(
          this.#address,
          bestOrFinalized
        ).subscribe((queue) => {
          this.queue = queue || 0n;

          document.dispatchEvent(
            new CustomEvent('new-fast-unstake-deposit', {
              detail: {
                address: this.#address,
                deposit: queue || 0n,
              },
            })
          );
        });
        this.#sub = unsub;
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
