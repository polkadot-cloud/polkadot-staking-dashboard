// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { makeCancelable } from '@polkadot-cloud/utils';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import { NetworkList } from 'config/networks';
import type { NetworkName } from 'types';
import type {
  ConnectionType,
  EventDetail,
  EventStatus,
  SubstrateConnect,
} from './types';

export class APIController {
  // The active network.
  static network: NetworkName;

  // API provider.
  static _provider: WsProvider | ScProvider;

  // API instance.
  static _api: ApiPromise;

  // Cancel function of dynamic substrate connect import.
  static cancelFn: () => void;

  static get api() {
    return this._api;
  }

  static get provider() {
    return this._provider;
  }

  // ------------------------------------------------------
  // Initialize API methods.
  // ------------------------------------------------------

  // Class initialization. Sets the `provider` and `api` class members.
  static async initialize(
    network: NetworkName,
    type: ConnectionType,
    config: {
      rpcEndpoint: string;
    }
  ) {
    this.dispatchEvent(this.ensureEventStatus('connecting'));

    // Set the new network to the class member and local storage.
    this.network = network;
    localStorage.setItem('network', network);

    await this.handleProvider(type, network, config.rpcEndpoint);
    await this.handleIsReady();
  }

  // Reconnect to a different endpoint.
  static async reconnect(
    network: NetworkName,
    type: ConnectionType,
    rpcEndpoint: string
  ) {
    await this.api.disconnect();
    this.resetEvents();
    this.dispatchEvent(this.ensureEventStatus('connecting'));

    // Set the new network to the class member and local storage.
    this.network = network;
    localStorage.setItem('network', network);

    await this.handleProvider(type, network, rpcEndpoint);
    await this.handleIsReady();
  }

  // Handles provider initialization.
  static handleProvider = async (
    type: ConnectionType,
    network: NetworkName,
    rpcEndpoint: string
  ) => {
    if (type === 'ws') {
      this.initWsProvider(network, rpcEndpoint);
    } else {
      await this.initScProvider(network);
    }
  };

  // Handles the API being ready.
  static handleIsReady = async () => {
    this.initEvents();
    this._api = await ApiPromise.create({ provider: this.provider });
    this.dispatchEvent(this.ensureEventStatus('ready'));
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
  static initEvents() {
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

  // Handler for dispatching events.
  static dispatchEvent(event: EventStatus, err?: string) {
    const detail: EventDetail = { event };
    if (err) {
      detail['err'] = err;
    }
    document.dispatchEvent(new CustomEvent('polkadot-api', { detail }));
  }

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
    if (
      status === 'connecting' ||
      status === 'connected' ||
      status === 'disconnected' ||
      status === 'ready' ||
      status === 'error'
    ) {
      return status as EventStatus;
    }
    return 'error' as EventStatus;
  };
}
