// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList, SystemChainList } from 'consts/networks'
import { Subscriptions } from 'controllers/Subscriptions'
import type { PolkadotClient } from 'polkadot-api'
import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import type { ChainId } from 'types'
import type { ApiChainType, PapiReadyEvent } from './types'

export class Api {
  // The network name associated with this Api instance
  network: ChainId

  // The type of chain being connected to
  #chainType: ApiChainType

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

  constructor(network: ChainId, chainType: ApiChainType) {
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
      const detail: PapiReadyEvent = {
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

    // Initialize Polkadot API Client
    this.#apiClient = createClient(getWsProvider(endpoint))
  }

  // Get a pallet constant, with a fallback value
  getConstant = async <T>(
    pallet: string,
    key: string,
    fallback: T,
    formatter?: 'asBytes'
  ): Promise<T> => {
    try {
      const result = await this.unsafeApi.constants[pallet][key]()

      switch (formatter) {
        case 'asBytes':
          return result.asBytes()
        default:
          return result
      }
    } catch (e) {
      return fallback
    }
  }

  // Unsubscribe from all active subscriptions and remove them from subscriptions controller
  unsubscribe = () => {
    const subs = Subscriptions.getAll(this.network)
    if (subs) {
      Object.entries(subs).forEach(([subscriptionId, subscription]) => {
        subscription.unsubscribe()
        Subscriptions.remove(this.network, subscriptionId)
      })
    }
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
