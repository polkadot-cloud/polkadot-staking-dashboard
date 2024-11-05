// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getLookupFn } from '@polkadot-api/metadata-builders';
import type { AnyJson, VoidFn } from '@w3ux/types';
import { ApiController } from 'controllers/Api';
import type { ObservableGetSubscription } from 'controllers/Subscriptions/types';
import type { NetworkName, SystemChainId } from 'types';

export class TaggedMetadata implements ObservableGetSubscription {
  // The associated chain for this instance.
  #chain: NetworkName | SystemChainId;

  // Unsubscribe object.
  #unsub: VoidFn;

  // Data to be returned.
  #value: AnyJson = null;

  constructor(chain: NetworkName | SystemChainId) {
    this.#chain = chain;
  }

  get = async () =>
    new Promise((resolve, reject) => {
      try {
        const client = ApiController.getInstanceApi(this.#chain, true);
        const observable = client.chainHead$().metadata$;

        // Handle subscription failure.
        const error = async () => {
          reject(null);
        };

        // Handle completion.
        const complete = async () => {
          resolve(this.#value);
        };

        const subscription = observable.subscribe({
          next: async (data: AnyJson) => {
            if (!data) {
              return;
            }
            // Check if this is the correct data to persist, return `null` otherwise.
            if (
              !('lookup' in data) ||
              !('pallets' in data) ||
              !('extrinsic' in data) ||
              !('type' in data) ||
              !('apis' in data) ||
              !('outerEnums' in data) ||
              !('custom' in data)
            ) {
              reject(null);
            } else {
              // Persist data to class. NOTE: Currently not using `LookupEntry`, can explore this
              // later.
              this.#value = getLookupFn(data)?.metadata || null;
            }

            // Call `complete` to stop observable emissions & resolve function.
            subscription.complete();
          },
          error,
          complete,
        });

        this.#unsub = subscription.unsubscribe;
      } catch (e) {
        reject(null);
      }
    });

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      this.#unsub();
    }
  };
}
