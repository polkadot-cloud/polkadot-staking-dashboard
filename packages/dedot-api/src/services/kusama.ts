// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { KusamaAssetHubApi } from '@dedot/chaintypes'
import type { KusamaApi } from '@dedot/chaintypes/kusama'
import type { KusamaPeopleApi } from '@dedot/chaintypes/kusama-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { BaseService } from '../defaultService/baseService'
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
  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<KusamaApi>,
    public apiPeople: DedotClient<KusamaPeopleApi>,
    public apiHub: DedotClient<KusamaAssetHubApi>
  ) {
    // For Kusama, staking happens on the relay chain
    super(networkConfig, ids, apiRelay, apiPeople, apiHub, apiRelay)
  }
}
