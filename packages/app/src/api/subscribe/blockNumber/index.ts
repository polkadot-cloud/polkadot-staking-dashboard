// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { NetworkId } from 'common-types';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';

export class BlockNumber extends Base implements Unsubscribable {
  // The current block number.
  blockNumber = '0';

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkId) {
    super(network);
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      if (this.#sub === undefined) {
        const bestOrFinalized = 'best';
        const unsub = this.unsafeApi.query.System.Number.watchValue(
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
