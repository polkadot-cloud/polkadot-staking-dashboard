// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotAssetHubApi } from '@dedot/chaintypes'
import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, ServiceInterface, SystemChainId } from 'types'
import { BaseService } from '../defaultService/baseService'
import { query } from '../query'
import { runtimeApi } from '../runtimeApi'
import { tx } from '../tx'
import { createPool } from '../tx/createPool'
import type { DefaultServiceClass } from '../types/serviceDefault'

export class PolkadotService
  extends BaseService<
    PolkadotApi,
    PolkadotPeopleApi,
    PolkadotAssetHubApi,
    PolkadotApi
  >
  implements
    DefaultServiceClass<
      PolkadotApi,
      PolkadotPeopleApi,
      PolkadotAssetHubApi,
      PolkadotApi
    >
{
  // Service interface
  interface: ServiceInterface

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<PolkadotApi>,
    public apiPeople: DedotClient<PolkadotPeopleApi>,
    public apiHub: DedotClient<PolkadotAssetHubApi>
  ) {
    // For Polkadot, staking happens on the relay chain
    super(networkConfig, ids, apiRelay, apiPeople, apiHub, apiRelay)
    
    // Initialize service interface with network-specific routing
    this.interface = {
      query: query(this.getApi),
      runtimeApi: runtimeApi(this.getApi),
      tx: tx(this.getApi),
      createPool: createPool(this.getApi),
    }
  }

  async start() {
    await super.start(this.interface)
  }
}
