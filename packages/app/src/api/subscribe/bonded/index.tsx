// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BondedAccount } from 'contexts/Bonded/types';
import { Apis } from 'controllers/Apis';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import type { NetworkId } from 'types';

export class Bonded implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkId;

  // The stash address.
  #address: string;

  // The bonded address.
  bonded: string;

  // Active subscription.
  #sub: Subscription;

  constructor(network: NetworkId, address: string) {
    this.#network = network;
    this.#address = address;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const api = Apis.getApi(this.#network);

      if (api && this.#sub === undefined) {
        const bestOrFinalized = 'best';
        const unsub = api.query.Staking.Bonded.watchValue(
          this.#address,
          bestOrFinalized
        ).subscribe((controller) => {
          const account: BondedAccount = {
            address: this.#address,
            bonded: controller || undefined,
          };

          // Send bonded account to UI.
          document.dispatchEvent(
            new CustomEvent('new-bonded-account', {
              detail: {
                account,
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
