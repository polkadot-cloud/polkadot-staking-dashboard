// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { BlockNumber } from '@polkadot/types/interfaces/runtime';
import { makeCancelable, withTimeout } from '@polkadot-cloud/utils';
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

  static CONNECT_TIMEOUT = 10000;

  // The active network.
  static network: NetworkName;

  // API provider.
  static _provider: WsProvider | ScProvider;

  // API provider unsubs.
  static _providerUnsubs: VoidFn[] = [];

  // API instance.
  static _api: ApiPromise;

  // The current RPC endpoint.
  static _rpcEndpoint: string;

  // The current connection type.
  static _connectionType: ConnectionType;

  // Unsubscribe objects.
  static _unsubs: Record<string, VoidFn> = {};

  // Store the number of connection attempts.
  static _connectAttempts = 0;

  // Cancel function of dynamic substrate connect import.
  static cancelFn: () => void;

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  static get provider() {
    return this._provider;
  }

  static get api() {
    return this._api;
  }

  // ------------------------------------------------------
  // Initialization and connection  API methods.
  // ------------------------------------------------------

  // Class initialization. Sets the `provider` and `api` class members.
  static async initialize(
    network: NetworkName,
    type: ConnectionType,
    rpcEndpoint: string,
    options?: {
      initial?: boolean;
    }
  ) {
    // Only needed once: Initialize window online listeners.
    if (options?.initial) {
      this.initOnlineEvents();
    } else {
      // Tidy up any previous connection.
      await this.disconnect();
    }

    const config: APIConfig = {
      type,
      network,
      rpcEndpoint,
    };
    this.handleConfig(config);
    this._connectAttempts++;
    this.onMonitorConnect(config);
    await withTimeout(this.CONNECT_TIMEOUT, this.connect(config));
  }

  // Handles class and local storage config.
  static handleConfig = async ({ type, network, rpcEndpoint }: APIConfig) => {
    localStorage.setItem('network', network);
    this.network = network;
    this._connectionType = type;
    this._rpcEndpoint = rpcEndpoint;
  };

  // Instantiates provider and connects to an api instance.
  static async connect({ type, network, rpcEndpoint }: APIConfig) {
    this.dispatchEvent(this.ensureEventStatus('connecting'));
    if (type === 'ws') {
      this.initWsProvider(network, rpcEndpoint);
    } else {
      await this.initScProvider(network);
    }
    await this.handleIsReady();
  }

  // Check if API is connected after a ser period, and try again if it has not.
  static onMonitorConnect = async (config: APIConfig) => {
    setTimeout(() => {
      // If blocks are not being subscribed to, assume connection failed.
      if (!Object.keys(this._unsubs).length) {
        // Atempt api connection again.
        this.initialize(config.network, config.type, config.rpcEndpoint);
      }
    }, this.CONNECT_TIMEOUT);
  };

  // Handles the API being ready.
  static handleIsReady = async () => {
    this.initApiEvents();
    this._api = await ApiPromise.create({ provider: this.provider });
    this._connectAttempts = 0;

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
    this._providerUnsubs.push(
      this.provider.on('connected', () => {
        this.dispatchEvent(this.ensureEventStatus('connected'));
      })
    );
    this._providerUnsubs.push(
      this.provider.on('disconnected', () => {
        this.dispatchEvent(this.ensureEventStatus('disconnected'));
      })
    );
    this._providerUnsubs.push(
      this.provider.on('error', (err: string) => {
        this.dispatchEvent(this.ensureEventStatus('error'), { err });
      })
    );
  }

  // Set up online / offline event listeners. Relays information to `document` for the UI to handle.
  static initOnlineEvents() {
    window.addEventListener('offline', async () => {
      await this.disconnect();
      // Tell UI api has been disconnected from an offline event.
      this.dispatchEvent(this.ensureEventStatus('disconnected'), {
        err: 'offline-event',
      });
    });
    window.addEventListener('online', () => {
      // Reconnect to the current API configuration.
      this.initialize(this.network, this._connectionType, this._rpcEndpoint);
    });
  }

  // Handler for dispatching events.
  static dispatchEvent(
    event: EventStatus,
    options?: {
      err?: string;
    }
  ) {
    const detail: EventDetail = { event };
    if (options?.err) {
      detail['err'] = options.err;
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
        // Send block number to UI as event.
        document.dispatchEvent(
          new CustomEvent(`new-block-number`, {
            detail: { blockNumber: num.toString() },
          })
        );
      });
      this._unsubs['blockNumber'] = unsub as unknown as VoidFn;
    }
  };

  // Unsubscribe from all active subscriptions.
  static unsubscribe = () => {
    Object.values(this._unsubs).forEach((unsub) => {
      unsub();
    });
    this._unsubs = {};
  };

  // Remove API event listeners if they exist.
  static unsubscribeProvider() {
    this._providerUnsubs.forEach((unsub) => {
      unsub();
    });
  }

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

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
    this.unsubscribeProvider();
    this.provider?.disconnect();
    await this.api?.disconnect();
  }
}
