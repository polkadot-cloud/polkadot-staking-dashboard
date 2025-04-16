// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { ChainId, NetworkConfig } from 'types'
import type { Chain } from '../types'
import { disaptch, formatApiStatusEvent } from '../util'

export class ApiStatus<T extends Chain> {
  constructor(
    public api: DedotClient<T>,
    public chainId: ChainId,
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
      this.dispatchEvent('reconnecting')
    })
    this.api.on('ready', () => {
      this.dispatchEvent('ready')
    })
    this.api.on('error', (err: Error) => {
      this.dispatchEvent('connecting', err)
    })
  }

  dispatchEvent(status: string, err?: Error) {
    disaptch(
      'apiStatus',
      formatApiStatusEvent(
        this.networkConfig.network,
        this.chainId,
        status,
        err
      )
    )
  }
}
