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
  PapiDynamicBuilder,
  PapiObservableClient,
} from './types';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import * as Sc from '@substrate/connect';
import type { JsonRpcProvider } from '@polkadot-api/substrate-client';
import type { MetadataLookup } from '@polkadot-api/metadata-builders';
import { getWsProvider } from '@polkadot-api/ws-provider/web';
import { createClient as createRawClient } from '@polkadot-api/substrate-client';
import { getObservableClient } from '@polkadot-api/observable-client';
// import { getSmProvider } from '@polkadot-api/sm-provider';
// import {
//   getLookupFn,
//   getDynamicBuilder,
// } from '@polkadot-api/metadata-builders';

export class Api {
  // The network name associated with this Api instance.
  network: NetworkName | SystemChainId;

  // The type of chain being connected to.
  #chainType: ApiChainType;

  // API provider.
  #provider: WsProvider | ScProvider;

  // API instance.
  #api: ApiPromise;

  // PAPI Provider.
  #papiProvider: JsonRpcProvider;

  // PAPI Instance.
  #papiClient: PapiObservableClient;

  // PAPI Dynamic Builder.
  #papiBuilder: PapiDynamicBuilder;

  // PAPI metadata.
  #papiMetadata: MetadataLookup;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current connection type.
  #connectionType: ConnectionType;

  get api() {
    return this.#api;
  }

  get connectionType() {
    return this.#connectionType;
  }

  get papiProvider() {
    return this.#papiProvider;
  }

  get papiClient() {
    return this.#papiClient;
  }

  get papiBuilder() {
    return this.#papiBuilder;
  }

  get papiMetadata() {
    return this.#papiMetadata;
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
        // Initialize PAPI provider.
        this.#papiProvider = getWsProvider(this.#rpcEndpoint);
      } else {
        await this.initScProvider();
        //TODO: connect to PAPI smProvider.
      }

      // Tell UI api is connecting.
      this.dispatchEvent(this.ensureEventStatus('connecting'));

      // Initialise Polkadot JS API.
      this.#api = new ApiPromise({ provider: this.#provider });

      // Initialize PAPI Client.
      this.#papiClient = getObservableClient(
        createRawClient(this.#papiProvider)
      );

      // NOTE: Unlike Polkadot JS API, observable client does not have an asynchronous
      // initialization stage that leads to `isReady`. If using observable client, we can
      // immediately attempt to fetch the chainSpec via the client.

      // Initialise api events.
      this.initApiEvents();

      // Fetch chain spec and metadata from PAPI client.
      await this.fetchChainSpec();

      // Wait for api to be ready.
      await this.#api.isReady;
    } catch (e) {
      // TODO: report a custom api status error that can flag to the UI the rpcEndpoint failed -
      // retry or select another one. Useful for custom endpoint configs.
      // this.dispatchEvent(this.ensureEventStatus('error'));
    }
  }

  async fetchChainSpec() {
    try {
      // TODO: Implement.
    } catch (e) {
      // Flag an error if there are any issues bootstrapping chain spec.
      this.dispatchEvent(this.ensureEventStatus('error'), {
        err: 'ChainSpecError',
      });
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
      this.dispatchEvent(this.ensureEventStatus('ready'));
    });

    this.#api.on('connected', () => {
      this.dispatchEvent(this.ensureEventStatus('connected'));
    });

    this.#api.on('disconnected', () => {
      this.dispatchEvent(this.ensureEventStatus('disconnected'));
    });

    this.#api.on('error', () => {
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

    // Tell UI Api is destroyed.
    if (destroy) {
      // NOTE: destroyed event is not currently in use.
      this.dispatchEvent(this.ensureEventStatus('destroyed'));
    }
  }
}
