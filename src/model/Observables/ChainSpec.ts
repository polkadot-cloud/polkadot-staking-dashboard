// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson, VoidFn } from '@w3ux/types';
import { ApiController } from 'controllers/Api';
import type { ObservableGetSubscription } from 'controllers/Subscriptions/types';
import type { NetworkName, SystemChainId } from 'types';

export class ChainSpec implements ObservableGetSubscription {
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
        const observable = client.chainHead$().follow$;

        // Handle subscription failure.
        const error = async (err: AnyJson) => {
          console.log(err);
          this.unsubscribe();
          reject(null);
        };

        // Handle completion.
        const complete = async () => {
          this.unsubscribe();
          resolve(this.#value);
        };

        const subscription = observable.subscribe({
          next: async (data: AnyJson) => {
            if (data?.type === 'initialized') {
              const {
                finalizedBlockRuntime: { spec },
              } = data;

              // Check if this is the correct data to persist, return `null` otherwise.
              if (
                !('apis' in spec) ||
                !('implName' in spec) ||
                !('implVersion' in spec) ||
                !('specName' in spec) ||
                !('specVersion' in spec) ||
                !('transactionVersion' in spec)
              ) {
                this.unsubscribe();
                reject(null);
              } else {
                // Persist chain spec data to class.
                this.#value = spec;
              }

              // Call `complete` to stop observable emissions & resolve function.
              subscription.complete();
              this.unsubscribe();
            }
          },
          error,
          complete,
        });

        this.#unsub = subscription.unsubscribe;
      } catch (e) {
        this.unsubscribe();
        reject(null);
      }
    });

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      console.log('UNSUBSCRIBING FROM CHAINSPEC');
      this.#unsub();
    }
  };
}
