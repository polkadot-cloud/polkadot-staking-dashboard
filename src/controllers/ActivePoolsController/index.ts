// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { defaultPoolNominations } from 'contexts/Pools/ActivePool/defaults';
import type { ActivePool, PoolRoles } from 'contexts/Pools/ActivePool/types';
import { IdentitiesController } from 'controllers/IdentitiesController';
import type { AnyApi } from 'types';
import type { ActivePoolItem, DetailActivePool } from './types';
import { SyncController } from 'controllers/SyncController';
import type { Nominations } from 'contexts/Balances/types';
import type { ApiPromise } from '@polkadot/api';

export class ActivePoolsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Pool ids that are being subscribed to.
  static pools: ActivePoolItem[] = [];

  // Active pools that are being returned from subscriptions, keyed by pool id.
  static activePools: Record<string, ActivePool | null> = {};

  // Active pool nominations, keyed by pool id.
  static poolNominations: Record<string, Nominations> = {};

  // Unsubscribe objects.
  static #unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Pool membership syncing.
  // ------------------------------------------------------

  // Subscribes to pools and unsubscribes from removed pools.
  static syncPools = async (
    api: ApiPromise,
    newPools: ActivePoolItem[]
  ): Promise<void> => {
    // Sync: Checking active pools.
    SyncController.dispatch('active-pools', 'syncing');

    // Handle pools that have been removed.
    this.handleRemovedPools(newPools);

    // Determine new pools that need to be subscribed to.
    const poolsAdded = newPools.filter(
      (newPool) => !this.pools.find((pool) => pool.id === newPool.id)
    );

    if (poolsAdded.length) {
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
              api,
              pool,
              bondedPool,
              rewardPool,
              accountData
            );
            this.handleNominatorsCallback(pool, nominators);

            if (this.activePools[pool.id] && this.poolNominations[pool.id]) {
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
        this.#unsubs[pool.id] = unsub;
      });
    } else {
      // Status: Pools Synced Completed.
      SyncController.dispatch('active-pools', 'complete');
    }
  };

  // Handle active pool callback.
  static handleActivePoolCallback = async (
    api: ApiPromise,
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
      api,
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
      };

      this.activePools[pool.id] = newPool;
    } else {
      // Invalid pools were returned. To signal pool was synced, set active pool to `null`.
      this.activePools[pool.id] = null;
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
      if (this.#unsubs[pool.id]) {
        this.#unsubs[pool.id]();
      }
      delete this.#unsubs[pool.id];
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
    Object.values(this.#unsubs).forEach((unsub) => {
      unsub();
    });
    this.#unsubs = {};
  };

  static resetState = (): void => {
    this.pools = [];
    this.activePools = {};
    this.poolNominations = {};
  };

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

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
  ): event is CustomEvent<DetailActivePool> =>
    event.detail && event.detail.pool && event.detail.nominations;
}
