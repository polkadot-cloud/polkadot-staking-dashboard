// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Api } from 'model/Api';
import type { ConnectionType } from 'model/Api/types';
import type { NetworkName } from 'types';

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
  static get(network: NetworkName) {
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

    // TODO: Add People chain instance.
    this.instances[network] = new Api(network);

    // TODO: Initialize People chain instance.
    await this.instances[network].initialize(type, rpcEndpoint);
  }

  // Gracefully disconnect and then destroy an Api instance.
  static async destroy(network: NetworkName) {
    const api = this.instances[network];
    if (api) {
      await api.disconnect(true);
      delete this.instances[network];
    }
  }
}
