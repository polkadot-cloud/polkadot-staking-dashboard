// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { NetworkName, SystemChainId } from 'types';
import { NetworkList, SystemChainList } from 'config/networks';
import type {
  ApiChainType,
  APIEventDetail,
  ConnectionType,
  EventApiStatus,
} from './types';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import * as Sc from '@substrate/connect';

export class Api {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The network name associated with this Api instance.
  network: NetworkName | SystemChainId;

  // The type of chain being connected to.
  #chainType: ApiChainType;

  // API provider.
  #provider: WsProvider | ScProvider;

  // API instance.
  #api: ApiPromise;

  // The connection status of the api.
  #status: EventApiStatus = 'disconnected';

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current connection type.
  #connectionType: ConnectionType;

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  get api() {
    return this.#api;
  }

  get connectionType() {
    return this.#connectionType;
  }

  get status() {
    return this.#status;
  }

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(network: NetworkName | SystemChainId, chainType: ApiChainType) {
    this.network = network;
    this.#chainType = chainType;
  }

  // ------------------------------------------------------
  // Initialization.
  // ------------------------------------------------------

  // Class initialization. Sets the `provider` and `api` class members.
  async initialize(type: ConnectionType, rpcEndpoint: string) {
    // Set connection metadata.
    this.#rpcEndpoint = rpcEndpoint;
    this.#connectionType = type;

    // Connect to api.
    await this.connect();
  }

  // Connect to Api instance.
  async connect() {
    try {
      // Initiate provider based on connection type.
      if (this.#connectionType === 'ws') {
        this.initWsProvider();
      } else {
        await this.initScProvider();
      }

      // Tell UI api is connecting.
      this.#status = 'connecting';
      this.dispatchEvent(this.ensureEventStatus('connecting'));

      // Initialise api.
      this.#api = new ApiPromise({ provider: this.#provider });

      // Initialise api events.
      this.initApiEvents();

      // Wait for api to be ready.
      await this.#api.isReady;
      this.#status = 'ready';
    } catch (e) {
      // TODO: report a custom api status error that can flag to the UI the rpcEndpoint failed -
      // retry or select another one. Useful for custom endpoint configs.
    }
  }

  // ------------------------------------------------------
  // Provider initialization.
  // ------------------------------------------------------

  // Initiate Websocket Provider.
  initWsProvider() {
    const endpoint =
      this.#chainType === 'relay'
        ? NetworkList[this.network].endpoints.rpcEndpoints[this.#rpcEndpoint]
        : SystemChainList[this.network].endpoints.rpcEndpoints[
            this.#rpcEndpoint
          ];

    this.#provider = new WsProvider(endpoint);
  }

  // Dynamically load and connect to Substrate Connect.
  async initScProvider() {
    // Get light client key from network list.
    const lightClientKey =
      this.#chainType === 'relay'
        ? NetworkList[this.network].endpoints.lightClient
        : SystemChainList[this.network].endpoints.lightClient;

    // Instantiate light client provider.
    this.#provider = new ScProvider(Sc, Sc.WellKnownChain[lightClientKey]);
    await this.#provider.connect();
  }

  // ------------------------------------------------------
  // Event handling.
  // ------------------------------------------------------

  // Set up API event listeners. Sends information to the UI.
  async initApiEvents() {
    this.#api.on('ready', async () => {
      this.#status = 'ready';
      this.dispatchEvent(this.ensureEventStatus('ready'));
    });

    this.#api.on('connected', () => {
      this.#status = 'connected';
      this.dispatchEvent(this.ensureEventStatus('connected'));
    });

    this.#api.on('disconnected', () => {
      this.#status = 'disconnected';
      this.dispatchEvent(this.ensureEventStatus('disconnected'));
    });

    this.#api.on('error', () => {
      this.#status = 'error';
      this.dispatchEvent(this.ensureEventStatus('error'));
    });
  }

  // Handler for dispatching events.
  dispatchEvent(
    status: EventApiStatus,
    options?: {
      err?: string;
    }
  ) {
    const detail: APIEventDetail = {
      network: this.network,
      chainType: this.#chainType,
      status,
      connectionType: this.#connectionType,
      rpcEndpoint: this.#rpcEndpoint,
    };
    if (options?.err) {
      detail['err'] = options.err;
    }
    document.dispatchEvent(new CustomEvent('api-status', { detail }));
  }

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Ensures the provided status is a valid `EventStatus` being passed, or falls back to `error`.
  ensureEventStatus = (status: string | EventApiStatus): EventApiStatus => {
    const eventStatus: string[] = [
      'connecting',
      'connected',
      'disconnected',
      'ready',
      'error',
      'destroyed',
    ];
    if (eventStatus.includes(status)) {
      return status as EventApiStatus;
    }
    return 'error' as EventApiStatus;
  };

  // Unsubscribe from all active subscriptions and remove them from subscriptions controller.
  unsubscribe = () => {
    const subs = SubscriptionsController.getAll(this.network);
    if (subs) {
      Object.entries(subs).forEach(([subscriptionId, subscription]) => {
        subscription.unsubscribe();
        SubscriptionsController.remove(this.network, subscriptionId);
      });
    }
  };

  // ------------------------------------------------------
  // Disconnect.
  // ------------------------------------------------------

  // Disconnect gracefully from API and provider.
  async disconnect(destroy = false) {
    this.unsubscribe();

    // Disconnect provider and api.
    await this.#provider?.disconnect();
    await this.#api?.disconnect();
    this.#status = 'disconnected';

    // Tell UI Api is destroyed.
    if (destroy) {
      // NOTE: destroyed event is not currently in use.
      this.dispatchEvent(this.ensureEventStatus('destroyed'));
    }
  }
}
