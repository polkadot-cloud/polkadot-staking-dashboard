// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Api } from 'api'
import type { ConnectionType } from 'api/types'
import type { ChainId, NetworkId } from 'common-types'
import { Syncs } from 'controllers/Syncs'

export class Apis {
  // The currently instantiated API instances, keyed by network.
  static #instances: Record<string, Api> = {}

  // Get an Api.
  static get(network: ChainId) {
    return this.#instances[network]
  }

  // Get the api client.
  static getClient(network: ChainId) {
    return this.#instances[network].apiClient
  }

  // Get the api instance.
  static getApi(network: ChainId) {
    return this.#instances[network].unsafeApi
  }

  static get instances() {
    return this.#instances
  }

  // Instantiate a new `Api` instance with the supplied chain id and endpoint.
  static async instantiate(
    network: NetworkId,
    type: ConnectionType,
    rpcEndpoint: string
  ) {
    // NOTE: This method should only be called to connect to a new network. We therefore assume we
    // want to disconnect from all other existing instances for the previous network.
    await Promise.all(
      Object.entries(this.#instances).map(async ([key]) => {
        await this.destroy(key as NetworkId)
      })
    )

    // 1. Update local storage and sync status.

    // Persist the selected network to local storage.
    localStorage.setItem('network', network)

    // Set app initializing. Even though `initialization` is added by default, it is called again
    // here in case the user switches networks.
    Syncs.dispatch('initialization', 'syncing')

    // 2. Instantiate chain Api instances.

    // Instantiate Api instance for relay chain.
    this.instances[network] = new Api(network, 'relay')

    //  Instantiate Api instance for People chain.
    this.instances[`people-${network}`] = new Api(`people-${network}`, 'system')

    //3. Initialize chain instances.

    this.instances[network].initialize(type, rpcEndpoint)

    // NOTE: Currently defaulting to websocket connection for system chains:
    this.instances[`people-${network}`].initialize(type, 'IBP2')
  }

  // Gracefully disconnect and then destroy an Api instance.
  static async destroy(network: ChainId) {
    // Disconnect from relay chain Api instance.
    const api = this.instances[network]
    if (api) {
      await api.disconnect(true)
      delete this.instances[network]
    }

    // Disconnect from People chain Api instance.
    const peopleApi = this.instances[`people-${network}`]
    if (peopleApi) {
      await peopleApi.disconnect(true)
      delete this.instances[`people-${network}`]
    }
  }
}
