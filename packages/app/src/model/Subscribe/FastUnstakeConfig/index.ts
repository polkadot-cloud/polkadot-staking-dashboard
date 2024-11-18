// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import type { NetworkName } from 'types';
import type { FastUnstakeConfigResult } from './types';

export class FastUnstakeConfig implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkName) {
    this.#network = network;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { pApi } = ApiController.get(this.#network);

      if (pApi && this.#sub === undefined) {
        const sub = combineLatest([
          pApi.query.FastUnstake.Head.watchValue(),
          pApi.query.FastUnstake.CounterForQueue.watchValue(),
        ]).subscribe(([head, counterForQueue]) => {
          const data: FastUnstakeConfigResult = {
            head,
            counterForQueue,
          };

          document.dispatchEvent(
            new CustomEvent('new-fast-unstake-data', {
              detail: { data },
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