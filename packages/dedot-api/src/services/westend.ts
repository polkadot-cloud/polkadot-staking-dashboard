// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendAssetHubApi } from '@dedot/chaintypes'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, ServiceInterface, SystemChainId } from 'types'
import { BaseService } from '../defaultService/baseService'
import { query } from '../query'
import { runtimeApi } from '../runtimeApi'
import { tx } from '../tx'
import { createPool } from '../tx/createPool'
import type { DefaultServiceClass } from '../types/serviceDefault'

export class WestendService
  extends BaseService<
    WestendApi,
    WestendPeopleApi,
    WestendAssetHubApi,
    WestendAssetHubApi
  >
  implements
    DefaultServiceClass<
      WestendApi,
      WestendPeopleApi,
      WestendAssetHubApi,
      WestendAssetHubApi
    >
{
  // Service interface
  interface: ServiceInterface

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<WestendApi>,
    public apiPeople: DedotClient<WestendPeopleApi>,
    public apiHub: DedotClient<WestendAssetHubApi>
  ) {
    // For Westend, staking happens on the asset hub
    super(networkConfig, ids, apiRelay, apiPeople, apiHub, apiHub)
    
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
