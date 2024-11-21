// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { AnyApi, NetworkName, SystemChainId } from 'types';
import { NetworkList, SystemChainList } from 'config/networks';
import type {
  ApiChainType,
  APIEventDetail,
  ConnectionType,
  EventApiStatus,
  PapiApi,
  PapiChainSpec,
  PapiReadyEvent,
} from './types';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import { WellKnownChain } from '@substrate/connect';
import * as Sc from '@substrate/connect';
import type { PolkadotClient } from 'polkadot-api';
import { createClient } from 'polkadot-api';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { getLightClientMetadata } from 'config/util';

export class Api {
  // The network name associated with this Api instance.
  network: NetworkName | SystemChainId;

  // The type of chain being connected to.
  #chainType: ApiChainType;

  // API provider.
  #provider: WsProvider | ScProvider;

  // PAPI Instance.
  #papiClient: PolkadotClient;

  // PAPI API.
  #pApi: PapiApi;

  // PAPI Chain Spec.
  #papiChainSpec: PapiChainSpec;

  // API instance.
  #api: ApiPromise;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current connection type.
  #connectionType: ConnectionType;

  get api() {
    return this.#api;
  }

  get papiClient() {
    return this.#papiClient;
  }

  get pApi() {
    return this.#pApi;
  }

  get papiChainSpec() {
    return this.#papiChainSpec;
  }

  get connectionType() {
    return this.#connectionType;
  }

  constructor(network: NetworkName | SystemChainId, chainType: ApiChainType) {
    this.network = network;
    this.#chainType = chainType;
  }

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
      this.dispatchEvent(this.ensureEventStatus('connecting'));

      // Initialise Polkadot JS API.
      this.#api = new ApiPromise({ provider: this.#provider });

      // Wait for api to be ready.
      await this.#api.isReady;

      // Initialise PAPI API.
      this.#pApi = this.#papiClient.getUnsafeApi();

      // Fetch chain spec and metadata from PAPI client.
      await this.fetchChainSpec();
    } catch (e) {
      // TODO: report a custom api status error that can flag to the UI the rpcEndpoint failed -
      // retry or select another one. Useful for custom endpoint configs.
      // this.dispatchEvent(this.ensureEventStatus('error'));
    }
  }

  // Initiate Websocket Provider.
  initWsProvider() {
    const endpoint =
      this.#chainType === 'relay'
        ? NetworkList[this.network].endpoints.rpcEndpoints[this.#rpcEndpoint]
        : SystemChainList[this.network].endpoints.rpcEndpoints[
            this.#rpcEndpoint
          ];

    // Initialize Polkadot JS Provider.
    this.#provider = new WsProvider(endpoint);

    // Initialize PAPI Client.
    this.#papiClient = createClient(getWsProvider(endpoint));
  }

  // Dynamically load and connect to Substrate Connect.
  async initScProvider() {
    // Get light client key from network list.
    const lightClientKey =
      this.#chainType === 'relay'
        ? NetworkList[this.network].endpoints.lightClientKey
        : SystemChainList[this.network].endpoints.lightClientKey;

    // Instantiate light client provider.
    this.#provider = new ScProvider(
      Sc as AnyApi,
      WellKnownChain[lightClientKey as keyof typeof WellKnownChain]
    );

    // Initialise PAPI light client.
    const smoldot = startFromWorker(new SmWorker());
    const smMetadata = getLightClientMetadata(this.#chainType, this.network);

    const chain = getSmProvider(
      smoldot.addChain({
        chainSpec: await smMetadata.chain.fn(),
        potentialRelayChains: smMetadata?.relay
          ? [await smoldot.addChain({ chainSpec: await smMetadata.relay.fn() })]
          : undefined,
      })
    );
    this.#papiClient = createClient(chain);

    // Connect to Polkadot JS API provider.
    await this.#provider.connect();
  }

  async fetchChainSpec() {
    try {
      const chainSpecData = await this.#papiClient.getChainSpecData();
      const version = await this.#pApi.constants.System.Version();

      const { genesisHash, properties } = chainSpecData;
      const { ss58Format, tokenDecimals, tokenSymbol } = properties;
      const {
        authoring_version: authoringVersion,
        impl_name: implName,
        impl_version: implVersion,
        spec_name: specName,
        spec_version: specVersion,
        state_version: stateVersion,
        transaction_version: transactionVersion,
      } = version;

      this.#papiChainSpec = {
        genesisHash,
        ss58Format,
        tokenDecimals,
        tokenSymbol,
        authoringVersion,
        implName,
        implVersion,
        specName,
        specVersion,
        stateVersion,
        transactionVersion,
      };

      // Dispatch ready eventd to let contexts populate constants.
      this.dispatchReadyEvent();
    } catch (e) {
      // TODO: Expand this when PJS API has been removed. Flag an error if there are any issues
      // bootstrapping chain spec. NOTE: This can happen when PAPI is the standalone connection
      // method.
      //this.dispatchEvent(this.ensureEventStatus('error'), { err: 'ChainSpecError' });
    }
  }

  // Get a pallet constant, with a fallback value.
  getConstant = async <T>(
    pallet: string,
    key: string,
    fallback: T,
    formatter?: 'asBytes'
  ): Promise<T> => {
    try {
      const result = await this.#pApi.constants[pallet][key]();

      switch (formatter) {
        case 'asBytes':
          return result.asBytes();
        default:
          return result;
      }
    } catch (e) {
      return fallback;
    }
  };

  // Handler for dispatching ready events.
  dispatchReadyEvent() {
    const detail: PapiReadyEvent = {
      network: this.network,
      chainType: this.#chainType,
      ...this.#papiChainSpec,
    };
    this.dispatchEvent(this.ensureEventStatus('ready'));
    document.dispatchEvent(new CustomEvent('papi-ready', { detail }));
  }

  // Handler for dispatching `api-status` events.
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

  // Disconnect gracefully from API and provider.
  async disconnect(destroy = false) {
    this.unsubscribe();

    // Disconnect provider and api.
    await this.#provider?.disconnect();
    await this.#api?.disconnect();

    // Disconnect from PAPI Client.
    this.#papiClient?.destroy();

    // Tell UI Api is destroyed.
    if (destroy) {
      // NOTE: destroyed event is not currently in use.
      this.dispatchEvent(this.ensureEventStatus('destroyed'));
    }
  }
}
