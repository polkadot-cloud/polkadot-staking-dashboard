// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress, NetworkName, SystemChainId } from 'types';
import type {
  AccountActivePools,
  AccountPoolNominations,
  ActivePoolItem,
  DetailActivePool,
} from './types';
import { SyncController } from 'controllers/Sync';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { ActivePoolAccount } from 'model/Subscribe/ActivePoolAccount';
import { defaultPoolNominations } from 'contexts/Pools/ActivePool/defaults';

export class ActivePoolsController {
  // Pool ids that are being subscribed to. Keyed by address.
  static pools: Record<string, ActivePoolItem[]> = {};

  // Map from an address to its associated pool ids
  static addressToPool: Record<string, string> = {};

  // Subscribes to new pools and unsubscribes from removed pools.
  static syncPools = async (
    network: NetworkName,
    address: MaybeAddress,
    newPools: ActivePoolItem[]
  ): Promise<void> => {
    if (!address) {
      return;
    }

    // Handle pools that have been removed.
    this.handleRemovedPools(network, address);

    const currentPool = this.addressToPool[address];

    // Determine new pools that need to be subscribed to.
    const updatedPool = newPools.find((newPool) => currentPool === newPool.id)
      ? false
      : newPools[0];

    if (updatedPool) {
      this.pools[address] = newPools;

      // Subscribe to and add new pool data.
      SubscriptionsController.set(
        network,
        `activePool-${address}-${updatedPool.id}`,
        new ActivePoolAccount(network, address, updatedPool)
      );

      // Add pool id to address mapping.
      this.addressToPool[address] = updatedPool.id;
    } else {
      // Status: Pools Synced Completed.
      SyncController.dispatch('active-pools', 'complete');
    }
  };

  // Remove pools that no longer exist.
  static handleRemovedPools = (
    network: NetworkName | SystemChainId,
    address: string
  ): void => {
    const currentPool = this.addressToPool[address];

    if (currentPool) {
      // Unsubscribe from removed pool subscription.
      SubscriptionsController.remove(
        network,
        `activePool-${address}-${currentPool}`
      );

      // Remove pool from class.
      delete this.addressToPool[address];
      delete this.pools[address];
    }
  };

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  // Gets pool for a provided address.
  static getPool = (
    network: NetworkName,
    address: MaybeAddress
  ): ActivePoolItem | undefined => {
    if (!address) {
      return undefined;
    }
    const activePoolAccount = SubscriptionsController.get(
      network,
      `activePool-${address}-${this.addressToPool[address]}`
    ) as ActivePoolAccount;

    return activePoolAccount?.pool || undefined;
  };

  // Gets active pool for a provided address.
  static getActivePool = (
    network: NetworkName,
    address: MaybeAddress
  ): AccountActivePools => {
    if (!address) {
      return {};
    }
    const poolId = this.addressToPool[address];
    const activePool = SubscriptionsController.get(
      network,
      `activePool-${address}-${poolId}`
    ) as ActivePoolAccount;

    if (!activePool) {
      return {};
    }

    return { [poolId]: activePool?.activePool || null };
  };

  // Gets active pool nominations for a provided address.
  static getPoolNominations = (
    network: NetworkName,
    address: MaybeAddress
  ): AccountPoolNominations => {
    if (!address) {
      return {};
    }
    const poolId = this.addressToPool[address];
    const activePool = SubscriptionsController.get(
      network,
      `activePool-${address}-${poolId}`
    ) as ActivePoolAccount;

    return {
      poolId: activePool?.poolNominations || defaultPoolNominations,
    };
  };

  // Gets all active pools for a provided network.
  static getAllActivePools = (network: NetworkName) =>
    Object.fromEntries(
      Object.entries(this.addressToPool).map(([addr, poolId]) => {
        const activePoolAccount = SubscriptionsController.get(
          network,
          `activePool-${addr}-${poolId}`
        ) as ActivePoolAccount;

        return [poolId, activePoolAccount?.activePool || null];
      })
    );

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
