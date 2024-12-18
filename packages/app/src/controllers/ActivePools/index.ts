// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ActivePoolAccount } from 'api/subscribe/activePoolAccount'
import type { ChainId, NetworkId } from 'common-types'
import { defaultPoolNominations } from 'contexts/Pools/ActivePool/defaults'
import { Subscriptions } from 'controllers/Subscriptions'
import { Syncs } from 'controllers/Syncs'
import type {
  AccountActivePools,
  AccountPoolNominations,
  ActivePoolItem,
  DetailActivePool,
  MaybeAddress,
} from 'types'

export class ActivePools {
  // Pool ids that are being subscribed to. Keyed by address
  static pools: Record<string, ActivePoolItem[]> = {}

  // Map from an address to its associated pool ids
  static addressToPool: Record<string, string> = {}

  // Subscribes to new pools and unsubscribes from removed pools
  static syncPools = async (
    network: NetworkId,
    address: MaybeAddress,
    newPools: ActivePoolItem[]
  ): Promise<void> => {
    if (!address) {
      return
    }

    // Handle pools that have been removed
    this.handleRemovedPools(network, address)

    // Determine new pools that need to be subscribed to
    const updatedPool = newPools.find(
      (newPool) => this.addressToPool[address] === newPool.id
    )
      ? false
      : newPools[0]

    if (updatedPool) {
      this.pools[address] = newPools
      // Subscribe to and add new pool data
      Subscriptions.set(
        network,
        `activePool-${address}-${updatedPool.id}`,
        new ActivePoolAccount(network, address, updatedPool)
      )
      // Add pool id to address mapping
      this.addressToPool[address] = updatedPool.id
    } else {
      // Status: Pools Synced Completed
      Syncs.dispatch('active-pools', 'complete')
    }
  }

  // Remove pools that no longer exist
  static handleRemovedPools = (network: ChainId, address: string): void => {
    const currentPool = this.addressToPool[address]
    if (currentPool) {
      Subscriptions.remove(network, `activePool-${address}-${currentPool}`)
      delete this.addressToPool[address]
      delete this.pools[address]
    }
  }

  // Gets pool for a provided address
  static getPool = (
    network: NetworkId,
    address: MaybeAddress
  ): ActivePoolItem | undefined => {
    if (!address) {
      return undefined
    }
    const activePoolAccount = Subscriptions.get(
      network,
      `activePool-${address}-${this.addressToPool[address]}`
    ) as ActivePoolAccount
    return activePoolAccount?.pool || undefined
  }

  // Gets active pool for a provided address
  static getActivePool = (
    network: NetworkId,
    address: MaybeAddress
  ): AccountActivePools => {
    if (!address) {
      return {}
    }
    const poolId = this.addressToPool[address]
    if (!poolId) {
      return {}
    }
    const activePool = Subscriptions.get(
      network,
      `activePool-${address}-${poolId}`
    ) as ActivePoolAccount
    if (!activePool) {
      return {}
    }
    return { [poolId]: activePool?.activePool || null }
  }

  // Gets active pool nominations for a provided address
  static getPoolNominations = (
    network: NetworkId,
    address: MaybeAddress
  ): AccountPoolNominations => {
    if (!address) {
      return {}
    }
    const poolId = this.addressToPool[address]
    if (!poolId) {
      return { poolId: defaultPoolNominations }
    }
    const activePool = Subscriptions.get(
      network,
      `activePool-${address}-${poolId}`
    ) as ActivePoolAccount
    return {
      poolId: activePool?.poolNominations || defaultPoolNominations,
    }
  }

  // Format pools into active pool items (id and addresses only)
  static getformattedPoolItems = (address: MaybeAddress): ActivePoolItem[] => {
    if (!address) {
      return []
    }
    return (
      this.pools?.[address]?.map(({ id, addresses }) => ({
        id: id.toString(),
        addresses,
      })) || []
    )
  }

  // Checks if event detail is a valid new active pool event
  static isValidNewActivePool = (
    event: CustomEvent
  ): event is CustomEvent<DetailActivePool> =>
    event.detail &&
    event.detail.address &&
    event.detail.pool &&
    event.detail.nominations
}
