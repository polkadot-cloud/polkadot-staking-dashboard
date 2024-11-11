// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import BigNumber from 'bignumber.js';
import { defaultActiveEra } from 'contexts/Api/defaults';
import type { APIActiveEra } from 'contexts/Api/types';
import { ApiController } from 'controllers/Api';
import { SubscriptionsController } from 'controllers/Subscriptions';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { AnyApi, NetworkName } from 'types';
import { StakingMetrics } from '../StakingMetrics';

export class ActiveEra implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated network for this instance.
  #network: NetworkName;

  // Unsubscribe object.
  #unsub: VoidFn;

  // Store the active era.
  activeEra: APIActiveEra = defaultActiveEra;

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
        const unsub = await api.query.staking.activeEra((result: AnyApi) => {
          // determine activeEra: toString used as alternative to `toHuman`, that puts commas in
          // numbers
          const activeEra = JSON.parse(result.unwrapOrDefault().toString());

          // Return early if errornous active era is returned.
          if (activeEra.index === 0 || !activeEra.start) {
            return;
          }

          // Store active era.
          this.activeEra = {
            index: new BigNumber(activeEra.index),
            start: new BigNumber(activeEra.start),
          };

          // Unsubscribe to staking metrics if it exists.
          const subStakingMetrics = SubscriptionsController.get(
            this.#network,
            'stakingMetrics'
          );
          if (subStakingMetrics) {
            subStakingMetrics.subscribe();
            SubscriptionsController.remove(this.#network, 'stakingMetrics');
          }

          // Subscribe to staking metrics with new active era.
          SubscriptionsController.set(
            this.#network,
            'stakingMetrics',
            new StakingMetrics(
              this.#network,
              this.activeEra,
              BigNumber.max(0, this.activeEra.index.minus(1))
            )
          );

          document.dispatchEvent(
            new CustomEvent('new-active-era', {
              detail: { activeEra },
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
