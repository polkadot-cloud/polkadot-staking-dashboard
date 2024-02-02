// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import BigNumber from 'bignumber.js';
import { APIController } from 'static/APIController';
import type { AnyApi } from 'types';

export interface ActivePoolItem {
  id: string;
  addresses: {
    stash: string;
    reward: string;
  };
}

// TODO: replace `ActivePoolsProvider` subscription with this class.
export class ActivePoolsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Pool ids and their addresses that are being subscribed to.
  static pools: ActivePoolItem[] = [];

  // Unsubscribe objects.
  static _unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Pool membership syncing.
  // ------------------------------------------------------

  // Subscribes to pools and unsubscribes from removed pools.
  static syncPools = async (newPools: ActivePoolItem[]): Promise<void> => {
    const { api } = APIController;

    // Handle pools that have been removed.
    this.handleRemovedPools(newPools);

    // Determine new pools that need to be subscribed to.
    const poolsAdded = newPools.filter(
      (newPool) => !this.pools.find((pool) => pool.id === newPool.id)
    );

    // Subscribe to and add new pool data.
    poolsAdded.forEach(async (pool) => {
      this.pools.push(pool);

      // TODO: break apart each query into separate handlers and only update / dispatch event if the
      // state has changed.
      const unsub = await api.queryMulti<AnyApi>(
        [
          [api.query.nominationPools.bondedPools, pool.id],
          [api.query.nominationPools.rewardPools, pool.id],
          [api.query.system.account, pool.addresses.reward],
        ],
        async ([bondedPool, rewardPool, accountData]): Promise<void> => {
          bondedPool = bondedPool?.unwrapOr(undefined)?.toHuman();
          rewardPool = rewardPool?.unwrapOr(undefined)?.toHuman();
          // eslint-disable-next-line
          const balance = accountData.data;

          if (bondedPool && rewardPool) {
            // TODO: implement.
          }
        }
      );
      this._unsubs[pool.id] = unsub;
    });
  };

  // Remove pools that no longer exist.
  static handleRemovedPools = (newPools: ActivePoolItem[]): void => {
    // Determine removed pools - current ones that no longer exist in `newPools`.
    const poolsRemoved = this.pools.filter(
      (pool) => !newPools.find((newPool) => newPool.id === pool.id)
    );

    // Unsubscribe from removed pool subscriptions.
    poolsRemoved.forEach((pool) => {
      this._unsubs[pool.id]();
      delete this._unsubs[pool.id];
    });

    // Remove removed pools from class.
    this.pools = this.pools.filter((pool) => !poolsRemoved.includes(pool));
  };

  // ------------------------------------------------------
  // Subscription handling.
  // ------------------------------------------------------

  // Unsubscribe from all subscriptions and reset class members.
  static unsubscribe = (): void => {
    Object.values(this._unsubs).forEach((unsub) => {
      unsub();
    });
    this.pools = [];
    this._unsubs = {};
  };

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Fetch and update unclaimed pool rewards for an address from runtime call.
  static fetchPendingRewards = async (address: string | undefined) => {
    if (address) {
      const { api } = APIController;
      const pendingRewards =
        await api.call.nominationPoolsApi.pendingRewards(address);

      return new BigNumber(pendingRewards?.toString() || 0);
    }
    return new BigNumber(0);
  };
}
