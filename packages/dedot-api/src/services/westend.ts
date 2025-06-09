// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { WestendAssetHubApi } from '@dedot/chaintypes'
import type { WestendApi } from '@dedot/chaintypes/westend'
import type { WestendPeopleApi } from '@dedot/chaintypes/westend-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { BaseService } from '../defaultService/baseService'
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
  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<WestendApi>,
    public apiPeople: DedotClient<WestendPeopleApi>,
    public apiHub: DedotClient<WestendAssetHubApi>
  ) {
    // For Westend, staking happens on the asset hub
    super(networkConfig, ids, apiRelay, apiPeople, apiHub, apiHub)
  }
}
