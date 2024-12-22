// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Configuration } from '@polkawatch/ddp-client'
import type { NetworkId } from 'common-types'

export class PolkaWatch {
  // Polkawatch API version
  static API_VERSION = 'v2'

  // Polkawatch supported networks
  static SUPPORTED_NETWORKS = ['polkadot', 'kusama']

  // Get API configuration for a given network
  static apiConfig = (network: NetworkId): Configuration =>
    new Configuration({
      basePath: `https://${network}-${this.API_VERSION}-api.polkawatch.app`,
    })
}
