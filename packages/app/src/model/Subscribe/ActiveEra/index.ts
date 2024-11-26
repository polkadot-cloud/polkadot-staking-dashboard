// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { defaultActiveEra } from 'contexts/Api/defaults';
import type { APIActiveEra } from 'contexts/Api/types';
import { ApiController } from 'controllers/Api';
import { SubscriptionsController } from 'controllers/Subscriptions';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import type { NetworkName } from 'types';
import { StakingMetrics } from '../StakingMetrics';

export class ActiveEra implements Unsubscribable {
  // The associated network for this instance.
  #network: NetworkName;

  // Active subscription.
  #sub: Subscription;

  // Store the active era.
  activeEra: APIActiveEra = defaultActiveEra;

  constructor(network: NetworkName) {
    this.#network = network;
    this.subscribe();
  }

  subscribe = async (): Promise<void> => {
    try {
      const { pApi } = ApiController.get(this.#network);

      if (pApi && this.#sub === undefined) {
        // Testing the active era subscription.
        const bestOrFinalized = 'best';
        const sub = pApi.query.Staking.ActiveEra.watchValue(
          bestOrFinalized
        ).subscribe((activeEra) => {
          // Store active era.
          this.activeEra = {
            index: new BigNumber(activeEra?.index.toString() || 0),
            start: new BigNumber(activeEra?.start?.toString() || 0),
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
