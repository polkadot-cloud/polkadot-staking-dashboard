// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from 'api/base';
import type { PolkadotClient } from 'polkadot-api';

export class ParaSessionAccounts extends Base {
  #session: number;

  constructor(client: PolkadotClient, session: number) {
    super(client);
    this.#session = session;
  }

  async fetch() {
    try {
      const result =
        await this.unsafeApi.query.ParaSessionInfo.AccountKeys.getValue(
          this.#session,
          { at: 'best' }
        );

      if (result) {
        return result;
      }
    } catch (e) {
      // Silent fail
    }

    return [];
  }
}
