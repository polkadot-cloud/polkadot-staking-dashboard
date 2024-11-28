// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Apis } from 'controllers/Apis';
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

  config: FastUnstakeConfigResult;

  constructor(network: NetworkName) {
    this.#network = network;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network);

      if (api && this.#sub === undefined) {
        const bestOrFinalized = 'best';

        const sub = combineLatest([
          api.query.FastUnstake.Head.watchValue(bestOrFinalized),
          api.query.FastUnstake.CounterForQueue.watchValue(bestOrFinalized),
        ]).subscribe(([head, counterForQueue]) => {
          const config: FastUnstakeConfigResult = {
            head: head || {
              stashes: [],
              checked: [],
            },
            counterForQueue,
          };

          this.config = config;

          document.dispatchEvent(
            new CustomEvent('new-fast-unstake-config', {
              detail: { ...config },
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
