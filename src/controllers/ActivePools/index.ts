// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { defaultPoolNominations } from 'contexts/Pools/ActivePool/defaults';
import type { ActivePool, PoolRoles } from 'contexts/Pools/ActivePool/types';
import { IdentitiesController } from 'controllers/Identities';
import type { AnyApi, MaybeAddress } from 'types';
import type {
  AccountActivePools,
  AccountPoolNominations,
  AccountUnsubs,
  ActivePoolItem,
  DetailActivePool,
} from './types';
import { SyncController } from 'controllers/Sync';
import type { Nominations } from 'contexts/Balances/types';
import type { ApiPromise } from '@polkadot/api';

export class ActivePoolsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Pool ids that are being subscribed to. Keyed by address.
  static pools: Record<string, ActivePoolItem[]> = {};

  // Active pools that are being returned from subscriptions, keyed by account address, then pool
  // id.
  static activePools: Record<string, AccountActivePools> = {};

  // Active pool nominations, keyed by account address, then pool id.
  static poolNominations: Record<string, AccountPoolNominations> = {};

  // Unsubscribe objects, keyed by account address, then pool id.
  static #unsubs: Record<string, AccountUnsubs> = {};

  // ------------------------------------------------------
  // Pool membership syncing.
  // ------------------------------------------------------

  // Subscribes to pools and unsubscribes from removed pools.
  static syncPools = async (
    api: ApiPromise,
    peopleApi: ApiPromise,
    peopleApiStatus: string,
    address: MaybeAddress,
    newPools: ActivePoolItem[]
  ): Promise<void> => {
    if (!address) {
      return;
    }

    // Handle pools that have been removed.
    this.handleRemovedPools(address, newPools);

    const currentPools = this.getPools(address);

    // Determine new pools that need to be subscribed to.
    const poolsAdded = newPools.filter(
      (newPool) => !currentPools.find(({ id }) => id === newPool.id)
    );

    if (poolsAdded.length) {
      // Subscribe to and add new pool data.
      poolsAdded.forEach(async (pool) => {
        this.pools[address] = currentPools.concat(pool);

        // TODO: Move to a `Subscription`.
        // Move subscription logic to `Subscribe` class.
        // Listen to subscription changes via event listener in this class.

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
              peopleApi,
              peopleApiStatus,
              address,
              pool,
              bondedPool,
              rewardPool,
              accountData
            );
            this.handleNominatorsCallback(address, pool, nominators);

            if (
              this.activePools?.[address]?.[pool.id] &&
              this.poolNominations?.[address]?.[pool.id]
            ) {
              document.dispatchEvent(
                new CustomEvent('new-active-pool', {
                  detail: {
                    address,
                    pool: this.activePools[address][pool.id],
                    nominations: this.poolNominations[address][pool.id],
                  },
                })
              );
            }
          }
        );
        this.setUnsub(address, pool.id, unsub);
      });
    } else {
      // Status: Pools Synced Completed.
      SyncController.dispatch('active-pools', 'complete');
    }
  };

  // Handle active pool callback.
  static handleActivePoolCallback = async (
    peopleApi: ApiPromise,
    peopleApiStatus: string,
    address: string,
    pool: ActivePoolItem,
    bondedPoolResult: AnyApi,
    rewardPoolResult: AnyApi,
    accountDataResult: AnyApi
  ): Promise<void> => {
    const bondedPool = bondedPoolResult?.unwrapOr(undefined)?.toHuman();
    const rewardPool = rewardPoolResult?.unwrapOr(undefined)?.toHuman();
    const balance = accountDataResult.data;
    const rewardAccountBalance = balance?.free.toString();

    if (peopleApi && peopleApiStatus === 'ready') {
      // Fetch identities for roles and expand `bondedPool` state to store them.
      bondedPool.roleIdentities = await IdentitiesController.fetch(
        peopleApi,
        this.getUniqueRoleAddresses(bondedPool.roles)
      );
    }

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

      this.setActivePool(address, pool.id, newPool);
    } else {
      // Invalid pools were returned. To signal pool was synced, set active pool to `null`.
      this.setActivePool(address, pool.id, null);
    }
  };

  // Handle nominators callback.
  static handleNominatorsCallback = (
    address: string,
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

    this.setPoolNominations(address, pool.id, newNominations);
  };

  // Remove pools that no longer exist.
  static handleRemovedPools = (
    address: string,
    newPools: ActivePoolItem[]
  ): void => {
    const currentPools = this.getPools(address);

    // Determine removed pools - current ones that no longer exist in `newPools`.
    const poolsRemoved = currentPools.filter(
      (pool) => !newPools.find((newPool) => newPool.id === pool.id)
    );

    // Unsubscribe from removed pool subscriptions.
    poolsRemoved.forEach((pool) => {
      if (this.#unsubs?.[address]?.[pool.id]) {
        this.#unsubs[address][pool.id]();
      }
      delete this.activePools[address][pool.id];
      delete this.poolNominations[address][pool.id];
    });

    // Remove removed pools from class.
    this.pools[address] = currentPools.filter(
      (pool) => !poolsRemoved.includes(pool)
    );

    // Tidy up empty class state.
    if (!this.pools[address].length) {
      delete this.pools[address];
    }

    if (!this.activePools[address]) {
      delete this.activePools[address];
    }

    if (!this.poolNominations[address]) {
      delete this.poolNominations[address];
    }
    if (!this.#unsubs[address]) {
      delete this.#unsubs[address];
    }
  };

  // ------------------------------------------------------
  // Subscription handling.
  // ------------------------------------------------------

  // Unsubscribe from all subscriptions and reset class members.
  static unsubscribe = (): void => {
    Object.values(this.#unsubs).forEach((accountUnsubs) => {
      Object.values(accountUnsubs).forEach((unsub) => {
        unsub();
      });
    });

    this.#unsubs = {};
  };

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  // Gets pools for a provided address.
  static getPools = (address: MaybeAddress): ActivePoolItem[] => {
    if (!address) {
      return [];
    }
    return this.pools?.[address] || [];
  };

  // Gets active pools for a provided address.
  static getActivePools = (address: MaybeAddress): AccountActivePools => {
    if (!address) {
      return {};
    }
    return this.activePools?.[address] || {};
  };

  // Gets active pool nominations for a provided address.
  static getPoolNominations = (
    address: MaybeAddress
  ): AccountPoolNominations => {
    if (!address) {
      return {};
    }
    return this.poolNominations?.[address] || {};
  };

  // Gets unique role addresses from a bonded pool's `roles` record.
  static getUniqueRoleAddresses = (roles: PoolRoles): string[] => {
    const roleAddresses: string[] = [
      ...new Set(Object.values(roles).filter((role) => role !== undefined)),
    ];
    return roleAddresses;
  };

  // ------------------------------------------------------
  // Setters.
  // ------------------------------------------------------

  // Set an active pool for an address.
  static setActivePool = (
    address: string,
    poolId: string,
    activePool: ActivePool | null
  ): void => {
    if (!this.activePools[address]) {
      this.activePools[address] = {};
    }
    this.activePools[address][poolId] = activePool;
  };

  // Set pool nominations for an address.
  static setPoolNominations = (
    address: string,
    poolId: string,
    nominations: Nominations
  ): void => {
    if (!this.poolNominations[address]) {
      this.poolNominations[address] = {};
    }
    this.poolNominations[address][poolId] = nominations;
  };

  // Set unsub for an address and pool id.
  static setUnsub = (address: string, poolId: string, unsub: VoidFn): void => {
    if (!this.#unsubs[address]) {
      this.#unsubs[address] = {};
    }
    this.#unsubs[address][poolId] = unsub;
  };

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Format pools into active pool items (id and addresses only).
  static getformattedPoolItems = (address: MaybeAddress): ActivePoolItem[] => {
    if (!address) {
      return [];
    }
    return (
      this.pools?.[address]?.map(({ id, addresses }) => ({
        id: id.toString(),
        addresses,
      })) || []
    );
  };

  // Checks if event detailis a valid `new-active-pool` event.
  static isValidNewActivePool = (
    event: CustomEvent
  ): event is CustomEvent<DetailActivePool> =>
    event.detail &&
    event.detail.address &&
    event.detail.pool &&
    event.detail.nominations;
}
