// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise, WsProvider } from '@polkadot/api';
import type { VoidFn } from '@polkadot/api/types';
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect';
import BigNumber from 'bignumber.js';
import { defaultActiveEra } from 'contexts/Api/defaults';
import type { APIActiveEra } from 'contexts/Api/types';
import { SyncController } from 'controllers/SyncController';
import type { AnyApi, NetworkName } from 'types';
import { NetworkList } from 'config/networks';
import { makeCancelable, rmCommas, stringToBigNumber } from '@w3ux/utils';
import { WellKnownChain } from '@substrate/connect';
import type {
  APIEventDetail,
  ConnectionType,
  EventApiStatus,
  SubstrateConnect,
} from './types';
import { SubscriptionsController } from 'controllers/SubscriptionsController';

export class Api {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

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

  get connectionType() {
    return this.#connectionType;
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
    // Add initial syncing items. Even though `initialization` is added by default, it is called
    // again here in case a new API is initialized.
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
      // TODO: report a custom api status error that can flag to the UI the rpcEndpoint failed -
      // retry or select another one. Useful for custom endpoint configs.
      // this.dispatchEvent(this.ensureEventStatus('error'));
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
    status: EventApiStatus,
    options?: {
      err?: string;
    }
  ) {
    const detail: APIEventDetail = {
      network: this.network,
      status,
      type: this.#connectionType,
      rpcEndpoint: this.#rpcEndpoint,
    };
    if (options?.err) {
      detail['err'] = options.err;
    }
    document.dispatchEvent(new CustomEvent('api-status', { detail }));
  }

  // ------------------------------------------------------
  // Subscription handling.
  // ------------------------------------------------------

  // TODO: Move these to `SubscriptionsController`, separate from this Api class.

  // Subscribe to active era.
  //
  // Also handles (re)subscribing to subscriptions that depend on active era.
  subscribeActiveEra = async (): Promise<void> => {
    const unsub = await this.api.query.staking.activeEra((result: AnyApi) => {
      // determine activeEra: toString used as alternative to `toHuman`, that puts commas in
      // numbers
      const activeEra = JSON.parse(result.unwrapOrDefault().toString());
      // Store active era.
      this.activeEra = {
        index: new BigNumber(activeEra.index),
        start: new BigNumber(activeEra.start),
      };

      // (Re)Subscribe to staking metrics `activeEra` has updated.
      if (this.#unsubs['stakingMetrics']) {
        this.#unsubs['stakingMetrics']();
        delete this.#unsubs['stakingMetrics'];
      }
      this.subscribeStakingMetrics();

      // NOTE: Sending `activeEra` to document as a strings. UI needs to parse values into
      // BigNumber.
      document.dispatchEvent(
        new CustomEvent(`new-active-era`, {
          detail: { activeEra },
        })
      );
    });
    this.#unsubs['activeEra'] = unsub as unknown as VoidFn;
  };

  // Subscribe to pools config.
  subscribePoolsConfig = async (): Promise<void> => {
    if (this.#unsubs['poolsConfig'] === undefined) {
      const unsub = await this.api.queryMulti(
        [
          this.api.query.nominationPools.counterForPoolMembers,
          this.api.query.nominationPools.counterForBondedPools,
          this.api.query.nominationPools.counterForRewardPools,
          this.api.query.nominationPools.lastPoolId,
          this.api.query.nominationPools.maxPoolMembers,
          this.api.query.nominationPools.maxPoolMembersPerPool,
          this.api.query.nominationPools.maxPools,
          this.api.query.nominationPools.minCreateBond,
          this.api.query.nominationPools.minJoinBond,
          this.api.query.nominationPools.globalMaxCommission,
        ],
        (result) => {
          // format optional configs to BigNumber or null.
          const maxPoolMembers = result[4].toHuman()
            ? new BigNumber(rmCommas(result[4].toString()))
            : null;

          const maxPoolMembersPerPool = result[5].toHuman()
            ? new BigNumber(rmCommas(result[5].toString()))
            : null;

          const maxPools = result[6].toHuman()
            ? new BigNumber(rmCommas(result[6].toString()))
            : null;

          const poolsConfig = {
            counterForPoolMembers: stringToBigNumber(result[0].toString()),
            counterForBondedPools: stringToBigNumber(result[1].toString()),
            counterForRewardPools: stringToBigNumber(result[2].toString()),
            lastPoolId: stringToBigNumber(result[3].toString()),
            maxPoolMembers,
            maxPoolMembersPerPool,
            maxPools,
            minCreateBond: stringToBigNumber(result[7].toString()),
            minJoinBond: stringToBigNumber(result[8].toString()),
            globalMaxCommission: Number(
              String(result[9]?.toHuman() || '100%').slice(0, -1)
            ),
          };

          document.dispatchEvent(
            new CustomEvent(`new-pools-config`, {
              detail: { poolsConfig },
            })
          );
        }
      );
      this.#unsubs['poolsConfig'] = unsub as unknown as VoidFn;
    }
  };

  // Subscribe to staking metrics.
  subscribeStakingMetrics = async (): Promise<void> => {
    if (this.#unsubs['stakingMetrics'] === undefined) {
      const previousEra = BigNumber.max(
        0,
        new BigNumber(this.activeEra.index).minus(1)
      );

      const unsub = await this.api.queryMulti(
        [
          this.api.query.staking.counterForNominators,
          this.api.query.staking.counterForValidators,
          this.api.query.staking.maxValidatorsCount,
          this.api.query.staking.validatorCount,
          [this.api.query.staking.erasValidatorReward, previousEra.toString()],
          [this.api.query.staking.erasTotalStake, previousEra.toString()],
          this.api.query.staking.minNominatorBond,
          [
            this.api.query.staking.erasTotalStake,
            this.activeEra.index.toString(),
          ],
        ],
        (result) => {
          const stakingMetrics = {
            totalNominators: stringToBigNumber(result[0].toString()),
            totalValidators: stringToBigNumber(result[1].toString()),
            maxValidatorsCount: stringToBigNumber(result[2].toString()),
            validatorCount: stringToBigNumber(result[3].toString()),
            lastReward: stringToBigNumber(result[4].toString()),
            lastTotalStake: stringToBigNumber(result[5].toString()),
            minNominatorBond: stringToBigNumber(result[6].toString()),
            totalStaked: stringToBigNumber(result[7].toString()),
          };

          document.dispatchEvent(
            new CustomEvent(`new-staking-metrics`, {
              detail: { stakingMetrics },
            })
          );
        }
      );
      this.#unsubs['stakingMetrics'] = unsub as unknown as VoidFn;
    }
  };

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
    // TODO: Remove this once subscriptions are active.
    Object.values(this.#unsubs).forEach((unsub) => {
      unsub();
    });
    this.#unsubs = {};
    // ---

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
