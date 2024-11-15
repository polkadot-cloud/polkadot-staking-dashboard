// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import type { NetworkName } from 'types';

export class NetworkMetrics implements Unsubscribable {
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
          pApi.query.Balances.TotalIssuance.watchValue(),
          pApi.query.Auctions.AuctionCounter.watchValue(),
          pApi.query.ParaSessionInfo.EarliestStoredSession.watchValue(),
          pApi.query.FastUnstake.ErasToCheckPerBlock.watchValue(),
          pApi.query.Staking.MinimumActiveStake.watchValue(),
        ]).subscribe(
          ([
            totalIssuance,
            auctionCounter,
            earliestStoredSession,
            erasToCheckPerBlock,
            minimumActiveStake,
          ]) => {
            const networkMetrics = {
              totalIssuance: new BigNumber(totalIssuance.toString()),
              auctionCounter: new BigNumber(auctionCounter),
              earliestStoredSession: new BigNumber(earliestStoredSession),
              fastUnstakeErasToCheckPerBlock: Number(erasToCheckPerBlock),
              minimumActiveStake: new BigNumber(minimumActiveStake.toString()),
            };

            document.dispatchEvent(
              new CustomEvent('new-network-metrics', {
                detail: { networkMetrics },
              })
            );
          }
        );

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
