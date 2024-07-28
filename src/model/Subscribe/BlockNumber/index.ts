// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/ApiController';
import type { Unsubscribable } from 'controllers/SubscriptionsController/types';
import type { NetworkName } from 'types';

export class BlockNumber implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated network for this instance.
  #network: NetworkName;

  // The current block number.
  blockNumber = '0';

  // Unsubscribe object.
  #unsub: VoidFn;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(network: NetworkName) {
    this.#network = network;

    // Subscribe immediately.
    this.subscribe();
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  subscribe = async (): Promise<void> => {
    try {
      const { api } = ApiController.get(this.#network);

      if (api && this.#unsub === undefined) {
        // Get block numbers.
        const unsub = await api.query.system.number((num: number) => {
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

        // Subscription now initialised. Store unsub.
        this.#unsub = unsub as unknown as VoidFn;
      }
    } catch (e) {
      // Block number subscription failed.
    }
  };

  // ------------------------------------------------------
  // Unsubscribe handler.
  // ------------------------------------------------------

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      this.#unsub();
    }
  };
}
