// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import BigNumber from 'bignumber.js';
import type { Nominations } from 'contexts/Bonded/types';
import { defaultPoolNominations } from 'contexts/Pools/ActivePools/defaults';
import type { ActivePool, PoolRoles } from 'contexts/Pools/ActivePools/types';
import { APIController } from 'static/APIController';
import { IdentitiesController } from 'static/IdentitiesController';
import type { AnyApi } from 'types';
import type { ActivePoolItem } from './types';

export class ActivePoolsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Pool ids that are being subscribed to.
  static pools: ActivePoolItem[] = [];

  // Active pools that are being returned from subscriptions, keyed by pool id.
  static activePools: Record<string, ActivePool> = {};

  // Active pool nominations, keyed by pool id.
  static poolNominations: Record<string, Nominations> = {};

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

      const unsub = await api.queryMulti<AnyApi>(
        [
          [api.query.nominationPools.bondedPools, pool.id],
          [api.query.nominationPools.rewardPools, pool.id],
          [api.query.system.account, pool.addresses.reward],
          [api.query.staking.nominators, pool.addresses.stash],
        ],
        async ([
          bondedPool,
          rewardPool,
          accountData,
          nominators,
        ]): Promise<void> => {
          // NOTE: async: fetches identity data for roles.
          await this.handleActivePoolCallback(
            pool,
            bondedPool,
            rewardPool,
            accountData
          );
          this.handleNominatorsCallback(pool, nominators);

          if (this.activePools[pool.id]) {
            document.dispatchEvent(
              new CustomEvent('new-active-pool', {
                detail: {
                  pool: this.activePools[pool.id],
                  nominations: this.poolNominations[pool.id],
                },
              })
            );
          }
        }
      );
      this._unsubs[pool.id] = unsub;
    });
  };

  // Handle active pool callback.
  static handleActivePoolCallback = async (
    pool: ActivePoolItem,
    bondedPoolResult: AnyApi,
    rewardPoolResult: AnyApi,
    accountDataResult: AnyApi
  ): Promise<void> => {
    const bondedPool = bondedPoolResult?.unwrapOr(undefined)?.toHuman();
    const rewardPool = rewardPoolResult?.unwrapOr(undefined)?.toHuman();
    const balance = accountDataResult.data;
    const rewardAccountBalance = balance?.free.toString();

    // Fetch identities for roles and expand `bondedPool` state to store them.
    bondedPool.roleIdentities = await IdentitiesController.fetch(
      this.getUniqueRoleAddresses(bondedPool.roles)
    );

    // Only persist the active pool to class state (and therefore dispatch an event) if both the
    // bonded pool and reward pool are returned.
    if (bondedPool && rewardPool) {
      const newPool = {
        id: Number(pool.id),
        addresses: pool.addresses,
        bondedPool,
        rewardPool,
        rewardAccountBalance,
        // NOTE: pending rewards are injected on the react side.
        pendingRewards: new BigNumber(0),
      };

      this.activePools[pool.id] = newPool;
    }
  };

  // Handle nominators callback.
  static handleNominatorsCallback = (
    pool: ActivePoolItem,
    nominatorsResult: AnyApi
  ): void => {
    const maybeNewNominations = nominatorsResult.unwrapOr(null);

    const newNominations: Nominations =
      maybeNewNominations === null
        ? defaultPoolNominations
        : {
            targets: maybeNewNominations.targets.toHuman(),
            submittedIn: maybeNewNominations.submittedIn.toHuman(),
          };

    this.poolNominations[pool.id] = newNominations;
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
      delete this.activePools[pool.id];
      delete this.poolNominations[pool.id];
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
    this.activePools = {};
    this.poolNominations = {};
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

  // Gets unique role addresses from a bonded pool's `roles` record.
  static getUniqueRoleAddresses = (roles: PoolRoles): string[] => {
    const roleAddresses: string[] = [
      ...new Set(Object.values(roles).filter((role) => role !== undefined)),
    ];
    return roleAddresses;
  };

  // Checks if event detailis a valid `new-active-pool` event.
  static isValidNewActivePool = (
    event: CustomEvent
  ): event is CustomEvent<{ pool: ActivePool; nominations: Nominations }> =>
    event.detail && event.detail.pool && event.detail.nominations;
}
