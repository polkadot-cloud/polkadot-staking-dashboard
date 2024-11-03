// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { AnyApi, NetworkName } from 'types';
import type { Proxy } from 'contexts/Proxies/types';
import BigNumber from 'bignumber.js';
import { rmCommas } from '@w3ux/utils';

export class AccountProxies implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // Unsubscribe object.
  #unsub: VoidFn;

  // The associated address for this subscription.
  #address: string;

  // Store proxies of the address.
  proxies: Proxy | undefined = undefined;

  constructor(network: NetworkName, address: string) {
    this.#network = network;
    this.#address = address;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { api } = ApiController.get(this.#network);

      if (api && this.#unsub === undefined) {
        const unsub = await api.queryMulti<AnyApi>(
          [[api.query.proxy.proxies, this.#address]],
          async ([result]) => {
            const data = result.toHuman();
            const newProxies = data[0];
            const reserved = new BigNumber(rmCommas(data[1]));

            // Check if proxies for this address already exist.
            const prevProxies = this.proxies;

            // Store subscription state.
            if (newProxies.length) {
              this.proxies = {
                address: this.#address,
                delegator: this.#address,
                delegates: newProxies.map((d: AnyApi) => ({
                  delegate: d.delegate.toString(),
                  proxyType: d.proxyType.toString(),
                })),
                reserved,
              };
            }

            // Send subscription data to UI if proxies data has previously been set.
            if (JSON.stringify(prevProxies) !== JSON.stringify(this.proxies)) {
              document.dispatchEvent(
                new CustomEvent('new-account-proxies', {
                  detail: { address: this.#address, proxies: this.proxies },
                })
              );
            }
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
