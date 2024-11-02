// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { NetworkName } from 'types';
import { stringToBn } from 'library/Utils';

export class PoolsConfig implements Unsubscribable {
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
            api.query.nominationPools.counterForPoolMembers,
            api.query.nominationPools.counterForBondedPools,
            api.query.nominationPools.counterForRewardPools,
            api.query.nominationPools.lastPoolId,
            api.query.nominationPools.maxPoolMembers,
            api.query.nominationPools.maxPoolMembersPerPool,
            api.query.nominationPools.maxPools,
            api.query.nominationPools.minCreateBond,
            api.query.nominationPools.minJoinBond,
            api.query.nominationPools.globalMaxCommission,
          ],
          (result) => {
            // format optional configs to BigNumber or null.
            const maxPoolMembers = result[4].toHuman()
              ? new BigNumber(rmCommas(result[4].toString()))
              : null;

            const maxPoolMembersPerPool = result[5].toHuman()
              ? new BigNumber(rmCommas(result[5].toString()))
              : null;

            const maxPools = result[6].toHuman()
              ? new BigNumber(rmCommas(result[6].toString()))
              : null;

            const poolsConfig = {
              counterForPoolMembers: stringToBn(result[0].toString()),
              counterForBondedPools: stringToBn(result[1].toString()),
              counterForRewardPools: stringToBn(result[2].toString()),
              lastPoolId: stringToBn(result[3].toString()),
              maxPoolMembers,
              maxPoolMembersPerPool,
              maxPools,
              minCreateBond: stringToBn(result[7].toString()),
              minJoinBond: stringToBn(result[8].toString()),
              globalMaxCommission: Number(
                String(result[9]?.toHuman() || '100%').slice(0, -1)
              ),
            };

            document.dispatchEvent(
              new CustomEvent(`new-pools-config`, {
                detail: { poolsConfig },
              })
            );
          }
        );

        // Subscription now initialised. Store unsub.
        this.#unsub = unsub as unknown as VoidFn;
      }
    } catch (e) {
      // Subscription failed.
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
