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
import BigNumber from 'bignumber.js';

export class APIController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // How long to wait for a connection before trying again.
  static CONNECT_TIMEOUT = 10000;

  // How many blocks to wait before verifying the connection is online.
  static MIN_EXPECTED_BLOCKS_PER_VERIFY = 3;

  // How many missing blocks to allow for leeway when verifying.
  static MIN_EXPECTED_BLOCKS_LEEWAY = 2;

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

  // The number of connection attempts.
  static _connectAttempts = 0;

  // The expected block time.
  static _expectedBlockTime: number;

  // The latest received block number.
  static _blockNumber = '0';

  // Block number verification data.
  static _blockNumberVerify: {
    minBlockNumber: string;
    interval: ReturnType<typeof setInterval> | undefined;
  } = {
    minBlockNumber: '0',
    interval: undefined,
  };

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

    // Handles class and local storage config.
    localStorage.setItem('network', network);
    this.network = network;
    this._connectionType = type;
    this._rpcEndpoint = rpcEndpoint;

    // Register connection attempt.
    this._connectAttempts++;

    // Start connection attempt.
    this.onMonitorConnect(config);
    await withTimeout(this.CONNECT_TIMEOUT, this.connect(config));
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

  // Instantiates provider and connects to an api instance.
  static async connect({ type, network, rpcEndpoint }: APIConfig) {
    // Tell UI api is connecting.
    this.dispatchEvent(this.ensureEventStatus('connecting'));

    // Initiate provider.
    if (type === 'ws') {
      this.initWsProvider(network, rpcEndpoint);
    } else {
      await this.initScProvider(network);
    }

    // Initialise provider events.
    this.initProviderEvents();

    // Initialise api.
    this._api = await ApiPromise.create({ provider: this.provider });

    // Reset connection attempts.
    this._connectAttempts = 0;

    // Tell UI api is ready.
    this.dispatchEvent(this.ensureEventStatus('ready'));

    // Subscribe to block numbers.
    this.subscribeBlockNumber();
  }

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
  // Subscription Handling.
  // ------------------------------------------------------

  // Subscribe to block number.
  static subscribeBlockNumber = async () => {
    if (this._unsubs['blockNumber'] === undefined) {
      // Retrieve and store the estimated block time.
      const blockTime = this.api.consts.babe.expectedBlockTime;
      this._expectedBlockTime = Number(blockTime.toString());

      // Get block numbers.
      const unsub = await this.api.query.system.number((num: BlockNumber) => {
        this._blockNumber = num.toString();

        // Send block number to UI as event.
        document.dispatchEvent(
          new CustomEvent(`new-block-number`, {
            detail: { blockNumber: num.toString() },
          })
        );
      });

      // Block number subscription now initialised. Store unsub.
      this._unsubs['blockNumber'] = unsub as unknown as VoidFn;

      // Bootstrap block number verification. Should always pass first verification.
      this._blockNumberVerify = {
        minBlockNumber: new BigNumber(this._blockNumber)
          .plus(this.MIN_EXPECTED_BLOCKS_PER_VERIFY)
          .toString(),
        interval: setInterval(
          () => {
            this.verifyBlocksOnline();
          },
          this._expectedBlockTime *
            (this.MIN_EXPECTED_BLOCKS_PER_VERIFY +
              this.MIN_EXPECTED_BLOCKS_LEEWAY)
        ),
      };
    }
  };

  // Verify block subscription is online.
  static verifyBlocksOnline = async () => {
    const blocksSynced = new BigNumber(
      this._blockNumber
    ).isGreaterThanOrEqualTo(this._blockNumberVerify.minBlockNumber);

    if (!blocksSynced) {
      this.handleOfflineEvent();
    } else {
      // Update block number verification data.
      this._blockNumberVerify.minBlockNumber = String(
        new BigNumber(this._blockNumber).plus(
          this.MIN_EXPECTED_BLOCKS_PER_VERIFY
        )
      ).toString();
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
  // Event handling.
  // ------------------------------------------------------

  // Set up API event listeners. Relays information to `document` for the UI to handle.
  static initProviderEvents() {
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
      this.handleOfflineEvent();
    });
    window.addEventListener('online', () => {
      // Reconnect to the current API configuration.
      this.initialize(this.network, this._connectionType, this._rpcEndpoint);
    });
  }

  // Handle offline event
  static handleOfflineEvent = async () => {
    await this.disconnect();
    // Tell UI api has been disconnected from an offline event.
    this.dispatchEvent(this.ensureEventStatus('disconnected'), {
      err: 'offline-event',
    });
  };

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
    clearInterval(this._blockNumberVerify.interval);
    this.unsubscribe();
    this.unsubscribeProvider();
    this.provider?.disconnect();
    await this.api?.disconnect();
  }
}
