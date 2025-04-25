// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList, SystemChainList } from 'consts/networks'
import type { PolkadotClient } from 'polkadot-api'
import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import type { ChainId } from 'types'

export class Api {
  // The network name associated with this Api instance
  network: ChainId

  // The type of chain being connected to
  #chainType: 'relay' | 'system'

  // API client.
  #apiClient: PolkadotClient

  // The current RPC endpoint
  #rpcEndpoint: string

  get apiClient() {
    return this.#apiClient
  }

  get unsafeApi() {
    return this.#apiClient.getUnsafeApi()
  }

  constructor(network: ChainId, chainType: 'relay' | 'system') {
    this.network = network
    this.#chainType = chainType
  }

  // Class initialization
  async initialize(rpcEndpoint: string) {
    this.#rpcEndpoint = rpcEndpoint
    await this.connect()
  }

  // Connect to Api instance
  async connect() {
    try {
      this.initWsProvider()
      const detail: { chainType: string } = {
        chainType: this.#chainType,
      }
      document.dispatchEvent(new CustomEvent('api-ready', { detail }))
    } catch (e) {
      // Do nothing
    }
  }

  // Initiate Websocket Provider
  initWsProvider() {
    const endpoint =
      this.#chainType === 'relay'
        ? NetworkList[this.network].endpoints.rpc[this.#rpcEndpoint]
        : SystemChainList[this.network].endpoints.rpc[this.#rpcEndpoint]
    this.#apiClient = createClient(getWsProvider(endpoint))
  }

  // Unsubscribe from all active subscriptions and remove them from subscriptions controller
  unsubscribe = () => {
    /* NOTE: deprecated */
  }

  // Disconnect gracefully from API and provider
  async disconnect() {
    this.unsubscribe()
    try {
      this.#apiClient?.destroy()
    } catch (e) {
      // Do nothing
    }
  }
}
