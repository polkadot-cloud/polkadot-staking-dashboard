// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PapiApi } from '../types';

export class SessionValidators {
  #api: PapiApi;

  constructor(api: PapiApi) {
    this.#api = api;
  }

  // Fetch network constants.
  async fetch() {
    try {
      const result = await this.#api.query.Session.Validators.getValue({
        at: 'best',
      });
      return result;
    } catch (e) {
      // Silently fail.
    }
    return [];
  }
}
