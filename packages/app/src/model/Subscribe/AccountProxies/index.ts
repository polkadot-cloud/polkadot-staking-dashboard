// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import type { AnyApi, NetworkName } from 'types';

export class AccountProxies implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // The proxy delegator address.
  #address: string;

  // The bonded address.
  proxies: AnyApi;

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkName, address: string) {
    this.#network = network;
    this.#address = address;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = ApiController.getApi(this.#network);

      if (api && this.#sub === undefined) {
        const bestOrFinalized = 'best';
        const unsub = api.query.Proxy.Proxies.watchValue(
          this.#address,
          bestOrFinalized
        ).subscribe((proxies) => {
          document.dispatchEvent(
            new CustomEvent('new-account-proxies', {
              detail: { address: this.#address, proxies },
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
