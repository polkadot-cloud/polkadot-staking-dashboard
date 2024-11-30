// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkList, SystemChainList } from 'config/networks';
import { getLightClientMetadata } from 'config/util';
import { Subscriptions } from 'controllers/Subscriptions';
import type { PolkadotClient } from 'polkadot-api';
import { createClient } from 'polkadot-api';
import { getSmProvider } from 'polkadot-api/sm-provider';
import { startFromWorker } from 'polkadot-api/smoldot/from-worker';
import SmWorker from 'polkadot-api/smoldot/worker?worker';
import { getWsProvider } from 'polkadot-api/ws-provider/web';
import type { ChainId } from 'types';
import type {
  ApiChainType,
  APIEventDetail,
  ConnectionType,
  EventApiStatus,
  PapiChainSpec,
  PapiReadyEvent,
} from './types';

export class Api {
  // The network name associated with this Api instance.
  network: ChainId;

  // The type of chain being connected to.
  #chainType: ApiChainType;

  // API client.
  #apiClient: PolkadotClient;

  // The fetched chain spec.
  #chainSpec: PapiChainSpec;

  // The current RPC endpoint.
  #rpcEndpoint: string;

  // The current connection type.
  #connectionType: ConnectionType;

  get apiClient() {
    return this.#apiClient;
  }

  get unsafeApi() {
    return this.#apiClient.getUnsafeApi();
  }

  get chainSpec() {
    return this.#chainSpec;
  }

  get connectionType() {
    return this.#connectionType;
  }

  constructor(network: ChainId, chainType: ApiChainType) {
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

      // Fetch chain spec and metadata from PAPI client.
      await this.fetchChainSpec();
    } catch (e) {
      // TODO: Handle unsupported chains in UI.
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

    // Initialize Polkadot API Client.
    this.#apiClient = createClient(getWsProvider(endpoint));
  }

  // Dynamically load and connect to Substrate Connect.
  async initScProvider() {
    // Initialise light client.
    const smoldot = startFromWorker(new SmWorker());
    const smMetadata = getLightClientMetadata(this.#chainType, this.network);
    const { chainSpec: relayChainSpec } = await smMetadata.relay.fn();

    let chain;
    if (this.#chainType === 'relay') {
      chain = smoldot.addChain({ chainSpec: relayChainSpec });
      this.#apiClient = createClient(getSmProvider(chain));
    } else {
      const { chainSpec: paraChainSpec } = await smMetadata!.para!.fn();
      chain = smoldot.addChain({
        chainSpec: paraChainSpec,
        potentialRelayChains: [
          await smoldot.addChain({ chainSpec: relayChainSpec }),
        ],
      });
      this.#apiClient = createClient(getSmProvider(chain));
    }
  }

  async fetchChainSpec() {
    try {
      const chainSpecData = await this.#apiClient.getChainSpecData();
      const version = await this.unsafeApi.constants.System.Version();

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

      this.#chainSpec = {
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
      // TODO: Handle unsupported chains in UI.
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
      const result = await this.unsafeApi.constants[pallet][key]();

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
      ...this.#chainSpec,
    };
    this.dispatchEvent(this.ensureEventStatus('ready'));
    document.dispatchEvent(new CustomEvent('api-ready', { detail }));
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
    const subs = Subscriptions.getAll(this.network);
    if (subs) {
      Object.entries(subs).forEach(([subscriptionId, subscription]) => {
        subscription.unsubscribe();
        Subscriptions.remove(this.network, subscriptionId);
      });
    }
  };

  // Disconnect gracefully from API and provider.
  async disconnect(destroy = false) {
    this.unsubscribe();

    // Disconnect client.
    try {
      this.#apiClient?.destroy();
    } catch (e) {
      // Suppress subscription errors.
    }

    // Tell UI Api has been disconnected.
    if (destroy) {
      this.dispatchEvent(this.ensureEventStatus('disconnected'));
    }
  }
}
