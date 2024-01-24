// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Configuration } from '@polkawatch/ddp-client';
import type { NetworkName } from 'types';

export class PolkaWatchController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Polkawatch API version.
  static API_VERSION = 'v2';

  // Polkawatch supported networks.
  static SUPPORTED_NETWORKS = ['polkadot', 'kusama'];

  // ------------------------------------------------------
  // API configuration.
  // ------------------------------------------------------

  // Get API configuration for a given network.
  static apiConfig = (network: NetworkName): Configuration =>
    new Configuration({
      basePath: `https://${network}-${this.API_VERSION}-api.polkawatch.app`,
    });
}
