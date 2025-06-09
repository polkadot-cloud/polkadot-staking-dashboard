// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaAssetHubApi } from '@dedot/chaintypes'
import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, ServiceInterface, SystemChainId } from 'types'
import { BaseService } from '../defaultService/baseService'
import { query } from '../query'
import { runtimeApi } from '../runtimeApi'
import { tx } from '../tx'
import { createPool } from '../tx/createPool'
import type { DefaultServiceClass } from '../types/serviceDefault'

export class KusamaService
  extends BaseService<KusamaApi, KusamaPeopleApi, KusamaAssetHubApi, KusamaApi>
  implements
    DefaultServiceClass<
      KusamaApi,
      KusamaPeopleApi,
      KusamaAssetHubApi,
      KusamaApi
    >
{
  // Service interface
  interface: ServiceInterface

  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<KusamaApi>,
    public apiPeople: DedotClient<KusamaPeopleApi>,
    public apiHub: DedotClient<KusamaAssetHubApi>
  ) {
    // For Kusama, staking happens on the relay chain
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
