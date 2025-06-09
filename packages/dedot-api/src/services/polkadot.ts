// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PolkadotAssetHubApi } from '@dedot/chaintypes'
import type { PolkadotApi } from '@dedot/chaintypes/polkadot'
import type { PolkadotPeopleApi } from '@dedot/chaintypes/polkadot-people'
import type { DedotClient } from 'dedot'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { BaseService } from '../defaultService/baseService'
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
  constructor(
    public networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<PolkadotApi>,
    public apiPeople: DedotClient<PolkadotPeopleApi>,
    public apiHub: DedotClient<PolkadotAssetHubApi>
  ) {
    // For Polkadot, staking happens on the relay chain
    super(networkConfig, ids, apiRelay, apiPeople, apiHub, apiRelay)
  }
}
