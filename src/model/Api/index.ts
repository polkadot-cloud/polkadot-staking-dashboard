// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { VoidFn } from '@polkadot/api/types';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import BigNumber from 'bignumber.js';
import { defaultActiveEra } from 'contexts/Api/defaults';
import type { APIActiveEra } from 'contexts/Api/types';
import type {
  ConnectionType,
  EventStatus,
  SubstrateConnect,
} from 'static/APIController/types';
import { SyncController } from 'static/SyncController';
import type { NetworkName } from 'types';
import { NetworkList } from 'config/networks';
import { makeCancelable } from '@w3ux/utils';
import { WellKnownChain } from '@substrate/connect';
import type { APIEventDetail } from './types';

export class Api {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Network config fallback values.
  // TODO: Explore how these values can be removed.
  FALLBACK = {
    MAX_NOMINATIONS: new BigNumber(16),
    BONDING_DURATION: new BigNumber(28),
    SESSIONS_PER_ERA: new BigNumber(6),
    MAX_ELECTING_VOTERS: new BigNumber(22500),
    EXPECTED_BLOCK_TIME: new BigNumber(6000),
    EPOCH_DURATION: new BigNumber(2400),
  };

  // The network name associated with this Api instance.
  network: NetworkName;

  // API provider.
  #provider: WsProvider | ScProvider;

  // API instance.
  #api: ApiPromise;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current connection type.
  #connectionType: ConnectionType;

  // Unsubscribe objects.
  #unsubs: Record<string, VoidFn> = {};

  // Cancel function of dynamic substrate connect import.
  cancelFn: () => void;

  // Store the active era.
  activeEra: APIActiveEra = defaultActiveEra;

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  get api() {
    return this.#api;
  }

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(network: NetworkName) {
    this.network = network;
  }

  // ------------------------------------------------------
  // Initialization.
  // ------------------------------------------------------

  // Class initialization. Sets the `provider` and `api` class members.
  async initialize(type: ConnectionType, rpcEndpoint: string) {
    // Add initial syncing items.
    SyncController.dispatch('initialization', 'syncing');

    // Persist the network to local storage.
    localStorage.setItem('network', this.network);

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
      this.dispatchEvent(this.ensureEventStatus('connecting'));

      // Initialise api.
      this.#api = new ApiPromise({ provider: this.#provider });

      // Initialise api events.
      this.initApiEvents();

      // Wait for api to be ready.
      await this.#api.isReady;
    } catch (e) {
      // TODO: dipatch connection error event. Test throwing an error to see if api connect attempts
      // continue to run.
    }
  }

  // ------------------------------------------------------
  // Provider initialization.
  // ------------------------------------------------------

  // Initiate Websocket Provider.
  initWsProvider() {
    this.#provider = new WsProvider(
      NetworkList[this.network].endpoints.rpcEndpoints[this.#rpcEndpoint]
    );
  }

  // Dynamically load and connect to Substrate Connect.
  async initScProvider() {
    // Dynamically load Substrate Connect.
    const ScPromise = makeCancelable(import('@substrate/connect'));
    this.cancelFn = ScPromise.cancel;
    const Sc = (await ScPromise.promise) as SubstrateConnect;

    // Get light client key from network list.
    const lightClientKey = NetworkList[this.network].endpoints
      .lightClient as WellKnownChain;

    // Instantiate light client provider.
    this.#provider = new ScProvider(Sc, WellKnownChain[lightClientKey]);
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
    event: EventStatus,
    options?: {
      err?: string;
    }
  ) {
    const detail: APIEventDetail = { network: this.network, event };
    if (options?.err) {
      detail['err'] = options.err;
    }
    document.dispatchEvent(new CustomEvent('polkadot-api', { detail }));
  }

  // ------------------------------------------------------
  // Class helpers.
  // ------------------------------------------------------

  // Ensures the provided status is a valid `EventStatus` being passed, or falls back to `error`.
  ensureEventStatus = (status: string | EventStatus): EventStatus => {
    const eventStatus: string[] = [
      'connecting',
      'connected',
      'disconnected',
      'ready',
      'error',
      'destroyed',
    ];
    if (eventStatus.includes(status)) {
      return status as EventStatus;
    }
    return 'error' as EventStatus;
  };

  // ------------------------------------------------------
  // Disconnect.
  // ------------------------------------------------------

  // Disconnect gracefully from API and provider.
  async disconnect(destroy = false) {
    // Disconnect provider and api.
    this.#provider?.disconnect();
    await this.#api?.disconnect();

    // Tell UI Api is destroyed.
    if (destroy) {
      // TODO: destroyed event is not currently in use.
      this.dispatchEvent(this.ensureEventStatus('destroyed'));
    }
  }
}
