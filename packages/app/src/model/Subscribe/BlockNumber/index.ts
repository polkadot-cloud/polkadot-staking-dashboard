// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Apis } from 'controllers/Apis';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import type { NetworkName } from 'types';

export class BlockNumber implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // The current block number.
  blockNumber = '0';

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkName) {
    this.#network = network;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network);

      if (api && this.#sub === undefined) {
        const bestOrFinalized = 'best';
        const unsub = api.query.System.Number.watchValue(
          bestOrFinalized
        ).subscribe((num) => {
          // Update class block number.
          this.blockNumber = num.toString();

          // Send block number to UI.
          document.dispatchEvent(
            new CustomEvent('new-block-number', {
              detail: {
                blockNumber: num.toString(),
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
