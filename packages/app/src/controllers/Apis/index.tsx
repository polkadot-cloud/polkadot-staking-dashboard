// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Api } from 'api'
import { Syncs } from 'controllers/Syncs'
import type { ChainId, NetworkId, ProviderType } from 'types'

export class Apis {
  // The currently instantiated API instances, keyed by network
  static #instances: Record<string, Api> = {}

  // Get an Api
  static get(network: ChainId) {
    return this.#instances[network]
  }

  // Get the api client
  static getClient(network: ChainId) {
    return this.#instances[network].apiClient
  }

  // Get the api instance
  static getApi(network: ChainId) {
    return this.#instances[network].unsafeApi
  }

  static get instances() {
    return this.#instances
  }

  // Instantiate a new `Api` instance with the supplied chain id and endpoint
  static async instantiate(
    network: NetworkId,
    type: ProviderType,
    rpcEndpoint: string
  ) {
    // NOTE: This method should only be called to connect to a new network. We therefore assume we
    // want to disconnect from all other existing instances for the previous network
    await Promise.all(
      Object.entries(this.#instances).map(async ([key]) => {
        await this.destroy(key as NetworkId)
      })
    )

    // 1. Update sync status

    // Set app initializing. Even though `initialization` is added by default, it is called again
    // here in case the user switches networks
    Syncs.dispatch('initialization', 'syncing')

    // 2. Instantiate chain Api instances

    // Instantiate Api instance for relay chain
    this.instances[network] = new Api(network, 'relay')

    //  Instantiate Api instance for People chain
    this.instances[`people-${network}`] = new Api(`people-${network}`, 'system')

    //3. Initialize chain instances

    this.instances[network].initialize(rpcEndpoint)

    // NOTE: Currently defaulting to websocket connection for system chains:
    this.instances[`people-${network}`].initialize('IBP2')
  }

  // Gracefully disconnect and then destroy an Api instance
  static async destroy(network: ChainId) {
    // Disconnect from relay chain Api instance
    const api = this.instances[network]
    if (api) {
      await api.disconnect()
      delete this.instances[network]
    }

    // Disconnect from People chain Api instance
    const peopleApi = this.instances[`people-${network}`]
    if (peopleApi) {
      await peopleApi.disconnect()
      delete this.instances[`people-${network}`]
    }
  }
}
