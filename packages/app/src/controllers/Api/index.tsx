// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SyncController } from 'controllers/Sync';
import { Api } from 'model/Api';
import type { ConnectionType } from 'model/Api/types';
import type { NetworkName, SystemChainId } from 'types';

export class ApiController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated API instances, keyed by tab id.
  static #instances: Record<string, Api> = {};

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  // Get an Api instance.
  static get(network: NetworkName | SystemChainId) {
    return this.#instances[network];
  }

  static get instances() {
    return this.#instances;
  }

  // ------------------------------------------------------
  // Api instance methods.
  // ------------------------------------------------------

  // Instantiate a new `Api` instance with the supplied chain id and endpoint.
  static async instantiate(
    network: NetworkName,
    type: ConnectionType,
    rpcEndpoint: string
  ) {
    // NOTE: This method should only be called to connect to a new network. We therefore assume we
    // want to disconnect from all other existing instances for the previous network.
    await Promise.all(
      Object.entries(this.#instances).map(async ([key]) => {
        await this.destroy(key as NetworkName);
      })
    );

    // 1. Update local storage and sync status.

    // Persist the selected network to local storage.
    localStorage.setItem('network', network);

    // Set app initializing. Even though `initialization` is added by default, it is called again
    // here in case the user switches networks.
    SyncController.dispatch('initialization', 'syncing');

    // 2. Instantiate chain Api instances.

    // Instantiate Api instance for relay chain.
    this.instances[network] = new Api(network, 'relay');

    //  Instantiate Api instance for People chain.
    this.instances[`people-${network}`] = new Api(
      `people-${network}`,
      'system'
    );

    //3. Initialize chain instances.

    await Promise.all([
      this.instances[network].initialize(type, rpcEndpoint),
      this.instances[`people-${network}`].initialize('ws', 'Parity'),
    ]);
  }

  // Gracefully disconnect and then destroy an Api instance.
  static async destroy(network: NetworkName) {
    // Disconnect from relay chain Api instance.
    const api = this.instances[network];
    if (api) {
      await api.disconnect(true);
      delete this.instances[network];
    }

    // Disconnect from People chain Api instance.
    const peopleApi = this.instances[`people-${network}`];
    if (peopleApi) {
      await peopleApi.disconnect(true);
      delete this.instances[`people-${network}`];
    }
  }
}
