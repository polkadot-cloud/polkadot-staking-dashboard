// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { NetworkConfig } from 'types'
import type { Chain } from '../types'
import type { EventApiStatus } from '../types/events'
import { disaptch } from '../util'

export class ApiStatus<T extends Chain> {
  constructor(
    public api: DedotClient<T>,
    public networkConfig: NetworkConfig
  ) {
    this.api = api
    this.networkConfig = networkConfig

    this.api.on('connected', () => {
      this.dispatchEvent('connected')
    })
    this.api.on('disconnected', () => {
      this.dispatchEvent('disconnected')
    })
    this.api.on('reconnecting', () => {
      this.dispatchEvent('connecting')
    })
    this.api.on('ready', () => {
      this.dispatchEvent('ready')
    })
    this.api.on('error', (err: Error) => {
      this.dispatchEvent('connecting', err)
    })
  }

  formatEvent(status: string, err?: Error): EventApiStatus {
    return {
      network: this.networkConfig.network,
      rpcEndpoints: this.networkConfig.rpcEndpoints,
      providerType: this.networkConfig.providerType,
      status,
      err,
    }
  }

  dispatchEvent(status: string, err?: Error) {
    console.log(status)
    disaptch('apiStatus', this.formatEvent(status, err))
  }
}
