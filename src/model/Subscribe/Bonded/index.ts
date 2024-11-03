// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { AnyApi, NetworkName } from 'types';
import type { BondedAccount } from './types';

export class Bonded implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated network for this instance.
  #network: NetworkName;

  // Unsubscribe object.
  #unsub: VoidFn;

  // The associated address for this subscription.
  #address: string;

  // Store the bonded account of this subscription.
  bondedAccount: BondedAccount;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(network: NetworkName, address: string) {
    this.#network = network;
    this.#address = address;
    this.subscribe();
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  subscribe = async (): Promise<void> => {
    try {
      const { api } = ApiController.get(this.#network);

      if (api && this.#unsub === undefined) {
        const unsub = await api.queryMulti<AnyApi>(
          [[api.query.staking.bonded, this.#address]],
          async ([controller]) => {
            // Define the bonded account.
            const newAccount: BondedAccount = {
              address: this.#address,
              bonded: controller.unwrapOr(null)?.toHuman() || null,
            };

            // Store subscription state.
            this.bondedAccount = newAccount;

            // Send subscription data to UI.
            document.dispatchEvent(
              new CustomEvent('new-bonded-account', {
                detail: { ...newAccount },
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
