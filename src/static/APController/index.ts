// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BlockNumber } from '@polkadot/types/interfaces/runtime';
import { makeCancelable } from '@polkadot-cloud/utils';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import { NetworkList } from 'config/networks';
import type { NetworkName } from 'types';
import type {
  APIConfig,
  ConnectionType,
  EventDetail,
  EventStatus,
  SubstrateConnect,
} from './types';
import type { VoidFn } from '@polkadot/api/types';

export class APIController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The active network.
  static network: NetworkName;

  // API provider.
  static _provider: WsProvider | ScProvider;

  // API instance.
  static _api: ApiPromise;

  // The current RPC endpoint.
  static _rpcEndpoint: string;

  // The current connection type.
  static _connectionType: ConnectionType;

  // Unsubscribe objects.
  static _unsubs: Record<string, VoidFn> = {};

  // Cancel function of dynamic substrate connect import.
  static cancelFn: () => void;

  static get api() {
    return this._api;
  }

  static get provider() {
    return this._provider;
  }

  // ------------------------------------------------------
  // Initialization and connection  API methods.
  // ------------------------------------------------------

  // Class initialization. Sets the `provider` and `api` class members.
  static async initialize(
    network: NetworkName,
    type: ConnectionType,
    options: {
      rpcEndpoint: string;
    }
  ) {
    // Only needed once: Initialize window online listeners.
    this.initOnlineEvents();

    const config: APIConfig = {
      type,
      network,
      rpcEndpoint: options.rpcEndpoint,
    };
    this.handleConfig(config);
    this.connect(config);
  }

  // Reconnect to a different endpoint. Assumes initialization has already happened.
  static async reconnect(
    network: NetworkName,
    type: ConnectionType,
    rpcEndpoint: string
  ) {
    await this.disconnect();
    this.resetEvents();

    const config: APIConfig = {
      type,
      network,
      rpcEndpoint,
    };
    this.handleConfig(config);
    this.connect(config);
  }

  // Instantiates provider and connects to an api instance.
  static async connect(config: APIConfig) {
    this.dispatchEvent(this.ensureEventStatus('connecting'));
    await this.handleProvider(config);
    await this.handleIsReady();
  }

  // Handles class and local storage config.
  static handleConfig = async ({ type, network, rpcEndpoint }: APIConfig) => {
    localStorage.setItem('network', network);
    this.network = network;
    this._connectionType = type;
    this._rpcEndpoint = rpcEndpoint;
  };

  // Handles provider initialization.
  static handleProvider = async ({ type, network, rpcEndpoint }: APIConfig) => {
    if (type === 'ws') {
      this.initWsProvider(network, rpcEndpoint);
    } else {
      await this.initScProvider(network);
    }
  };

  // Handles the API being ready.
  static handleIsReady = async () => {
    this.initApiEvents();
    this._api = await ApiPromise.create({ provider: this.provider });
    this.dispatchEvent(this.ensureEventStatus('ready'));

    // Subscribe to block numbers.
    this.subscribeBlockNumber();
  };

  // ------------------------------------------------------
  // Provider initialization.
  // ------------------------------------------------------

  // Initiate Websocket Provider.
  static initWsProvider(network: NetworkName, rpcEndpoint: string) {
    this._provider = new WsProvider(
      NetworkList[network].endpoints.rpcEndpoints[rpcEndpoint]
    );
  }

  // Dynamically load substrate connect.
  static async initScProvider(network: NetworkName) {
    // Dynamically load substrate connect.
    const ScPromise = makeCancelable(import('@substrate/connect'));
    this.cancelFn = ScPromise.cancel;
    const Sc = (await ScPromise.promise) as SubstrateConnect;

    this._provider = new ScProvider(
      // @ts-expect-error mismatch between `@polkadot/rpc-provider/substrate-connect` and  `@substrate/connect` types: Chain[]' is not assignable to type 'string'.
      Sc,
      NetworkList[network].endpoints.lightClient
    );
    await this.provider.connect();
  }

  // ------------------------------------------------------
  // Event handling.
  // ------------------------------------------------------

  // Set up API event listeners. Relays information to `document` for the UI to handle.
  static initApiEvents() {
    this.provider.on('connected', () => {
      this.dispatchEvent(this.ensureEventStatus('connected'));
    });
    this.provider.on('disconnected', () => {
      this.dispatchEvent(this.ensureEventStatus('disconnected'));
    });
    this.provider.on('error', (err: string) => {
      this.dispatchEvent(this.ensureEventStatus('error'), err);
    });
  }

  // Set up online / offline event listeners. Relays information to `document` for the UI to handle.
  static initOnlineEvents() {
    window.addEventListener('offline', async () => {
      await this.disconnect();

      // Tell UI api has been disconnected from an offline event.
      this.dispatchEvent(
        this.ensureEventStatus('disconnected'),
        'offline-event'
      );
    });

    window.addEventListener('online', () => {
      // Reconnect to the current API configuration.
      this.reconnect(this.network, this._connectionType, this._rpcEndpoint);
    });
  }

  // Handler for dispatching events.
  static dispatchEvent(event: EventStatus, err?: string) {
    const detail: EventDetail = { event };
    if (err) {
      detail['err'] = err;
    }
    document.dispatchEvent(new CustomEvent('polkadot-api', { detail }));
  }

  // ------------------------------------------------------
  // Subscription Handling.
  // ------------------------------------------------------

  // Subscribe to block number.
  static subscribeBlockNumber = async () => {
    if (this._unsubs['blockNumber'] === undefined) {
      const unsub = await this.api.query.system.number((num: BlockNumber) => {
        // TODO: dispatch event to document for UI to handle.
        console.log(num.toNumber());
      });
      this._unsubs['blockNumber'] = unsub as unknown as VoidFn;
    }
  };

  // Unsubscribe from all active subscriptions.
  static unsubscribe = () => {
    Object.values(this._unsubs).forEach((unsub) => {
      unsub();
    });
  };

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Remove API event listeners.
  static resetEvents() {
    this.provider.on('connected', () => {
      /* No nothing */
    });
    this.provider.on('disconnected', () => {
      /* No nothing */
    });
    this.provider.on('error', () => {
      /* No nothing */
    });
  }

  // Ensures the provided status is a valid `EventStatus` being passed, or falls back to `error`.
  static ensureEventStatus = (status: string | EventStatus): EventStatus => {
    const eventStatus: string[] = [
      'connecting',
      'connected',
      'disconnected',
      'ready',
      'error',
    ];
    if (eventStatus.includes(status)) {
      return status as EventStatus;
    }
    return 'error' as EventStatus;
  };

  // Disconnect gracefully from API.
  static async disconnect() {
    this.unsubscribe();
    await this.api?.disconnect();
  }
}
