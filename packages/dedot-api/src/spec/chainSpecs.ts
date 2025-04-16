// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import type { ChainProperties } from 'dedot/types/json-rpc'
import type { HexString } from 'dedot/utils'
import type { Chain } from '../types'

export class ChainSpecs<T extends Chain> {
  genesisHash: HexString
  properties: ChainProperties
  existentialDeposit: bigint
  version: {
    specName: string
    implName: string
    authoringVersion: number
    specVersion: number
    implVersion: number
    apis: (readonly [`0x${string}`, number])[]
    transactionVersion: number
    stateVersion: number
  }

  constructor(public api: DedotClient<T>) {
    this.api = api
  }

  async get() {
    this.genesisHash = await this.api.chainSpec.genesisHash()
    this.properties = await this.api.chainSpec.properties()
    this.existentialDeposit = this.api.consts.balances.existentialDeposit
    this.version = this.api.consts.system.version
  }
}
