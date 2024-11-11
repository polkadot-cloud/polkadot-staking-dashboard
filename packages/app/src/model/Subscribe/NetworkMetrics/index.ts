// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { NetworkName } from 'types';

export class NetworkMetrics implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated network for this instance.
  #network: NetworkName;

  // Unsubscribe object.
  #unsub: VoidFn;

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
        const unsub = await api.queryMulti(
          [
            api.query.balances.totalIssuance,
            api.query.auctions.auctionCounter,
            api.query.paraSessionInfo.earliestStoredSession,
            api.query.fastUnstake.erasToCheckPerBlock,
            api.query.staking.minimumActiveStake,
          ],
          (result) => {
            const networkMetrics = {
              totalIssuance: new BigNumber(result[0].toString()),
              auctionCounter: new BigNumber(result[1].toString()),
              earliestStoredSession: new BigNumber(result[2].toString()),
              fastUnstakeErasToCheckPerBlock: Number(
                rmCommas(result[3].toString())
              ),
              minimumActiveStake: new BigNumber(result[4].toString()),
            };

            document.dispatchEvent(
              new CustomEvent('new-network-metrics', {
                detail: { networkMetrics },
              })
            );
          }
        );

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
