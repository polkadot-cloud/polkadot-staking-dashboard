// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient } from 'dedot'
import {
  defaultSyncStatus,
  removeSyncing,
  setConsts,
  setMultiChainSpecs,
  setSyncingMulti,
} from 'global-bus'
import type { NetworkConfig, NetworkId, SystemChainId } from 'types'
import { CoreConsts } from '../consts/core'
import { StakingConsts } from '../consts/staking'
import { ApiStatus } from '../spec/apiStatus'
import { ChainSpecs } from '../spec/chainSpecs'
import { ActiveEraQuery } from '../subscribe/activeEra'
import { BlockNumberQuery } from '../subscribe/blockNumber'
import { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import { PoolsConfigQuery } from '../subscribe/poolsConfig'
import { RelayMetricsQuery } from '../subscribe/relayMetrics'
import type {
  AssetHubChain,
  PeopleChain,
  RelayChain,
  StakingChain,
} from '../types'
import type { ChainConfig } from './chainConfig'
import { createServiceInterface } from './interfaceFactory'
import { SubscriptionManager } from './subscriptionManager'

/**
 * Base service utility that handles common initialization and management
 */
export class BaseService<
  RelayApi extends RelayChain,
  PeopleApi extends PeopleChain,
  HubApi extends AssetHubChain,
  StakingApi extends StakingChain,
> {
  // Chain specs
  relayChainSpec: ChainSpecs<RelayApi>
  peopleChainSpec: ChainSpecs<PeopleApi>
  hubChainSpec: ChainSpecs<HubApi>

  // API status
  apiStatus: {
    relay: ApiStatus<RelayApi>
    people: ApiStatus<PeopleApi>
    hub: ApiStatus<HubApi>
  }

  // Constants
  coreConsts: CoreConsts<RelayApi>
  stakingConsts: StakingConsts<StakingApi>

  // Query objects
  blockNumber: BlockNumberQuery<RelayApi>
  activeEra: ActiveEraQuery<StakingApi>
  relayMetrics: RelayMetricsQuery<RelayApi>
  poolsConfig: PoolsConfigQuery<StakingApi>
  fastUnstakeConfig: FastUnstakeConfigQuery<StakingApi>

  // Subscription manager
  subscriptionManager: SubscriptionManager<
    RelayApi,
    PeopleApi,
    HubApi,
    StakingApi
  >

  // Service interface
  interface: ServiceInterface

  constructor(
    private networkConfig: NetworkConfig,
    public ids: [NetworkId, SystemChainId, SystemChainId],
    public apiRelay: DedotClient<RelayApi>,
    public apiPeople: DedotClient<PeopleApi>,
    public apiHub: DedotClient<HubApi>,
    private chainConfig: ChainConfig<RelayApi, PeopleApi, HubApi, StakingApi>
  ) {
    this.apiStatus = {
      relay: new ApiStatus(this.apiRelay, ids[0], networkConfig),
      people: new ApiStatus(this.apiPeople, ids[1], networkConfig),
      hub: new ApiStatus(this.apiHub, ids[2], networkConfig),
    }
  }

  /**
   * Standard getApi implementation used by all services
   */
  getApi = (id: string) => {
    if (id === this.ids[0]) {
      return this.apiRelay
    } else if (id === this.ids[1]) {
      return this.apiPeople
    } else {
      return this.apiHub
    }
  }

  /**
   * Initialize the service with common setup logic
   */
  async start() {
    // Initialize chain specs
    this.relayChainSpec = new ChainSpecs(this.apiRelay)
    this.peopleChainSpec = new ChainSpecs(this.apiPeople)
    this.hubChainSpec = new ChainSpecs(this.apiHub)

    // Initialize constants
    this.coreConsts = new CoreConsts(
      this.chainConfig.getCoreConstApi(
        this.apiRelay,
        this.apiPeople,
        this.apiHub
      )
    )
    this.stakingConsts = new StakingConsts(
      this.chainConfig.getStakingApi(this.apiRelay, this.apiPeople, this.apiHub)
    )

    // Set default sync status
    setSyncingMulti(defaultSyncStatus)

    // Fetch chain specs
    await Promise.all([
      this.relayChainSpec.fetch(),
      this.peopleChainSpec.fetch(),
      this.hubChainSpec.fetch(),
    ])

    // Set multi-chain specs and constants
    setMultiChainSpecs({
      [this.ids[0]]: this.relayChainSpec.get(),
      [this.ids[1]]: this.peopleChainSpec.get(),
      [this.ids[2]]: this.hubChainSpec.get(),
    })
    setConsts(this.ids[0], {
      ...this.coreConsts.get(),
      ...this.stakingConsts.get(),
    })

    // Initialize query objects
    this.blockNumber = new BlockNumberQuery(this.apiRelay)
    this.activeEra = new ActiveEraQuery(
      this.chainConfig.getStakingApi(this.apiRelay, this.apiPeople, this.apiHub)
    )
    this.relayMetrics = new RelayMetricsQuery(this.apiRelay)
    this.poolsConfig = new PoolsConfigQuery(
      this.chainConfig.getStakingApi(this.apiRelay, this.apiPeople, this.apiHub)
    )
    this.fastUnstakeConfig = new FastUnstakeConfigQuery(
      this.chainConfig.getStakingApi(this.apiRelay, this.apiPeople, this.apiHub)
    )

    // Initialize service interface
    this.interface = createServiceInterface(
      this.apiRelay,
      this.apiPeople,
      this.apiHub,
      this.ids,
      this.chainConfig,
      this.getApi
    )

    // Initialize subscription manager
    this.subscriptionManager = new SubscriptionManager(
      this.apiRelay,
      this.apiPeople,
      this.apiHub,
      this.ids,
      this.chainConfig,
      this.stakingConsts,
      this.interface
    )

    // Set up the active era subscription
    this.subscriptionManager.setActiveEraSubscription(this.activeEra.activeEra$)

    // Initialize all dynamic subscriptions
    this.subscriptionManager.initializeDynamicSubscriptions()

    removeSyncing('initialization')
  }

  /**
   * Common unsubscribe logic
   */
  async unsubscribe() {
    await this.subscriptionManager.unsubscribe()

    this.blockNumber?.unsubscribe()
    this.relayMetrics?.unsubscribe()
    this.poolsConfig?.unsubscribe()
    this.fastUnstakeConfig?.unsubscribe()
    this.activeEra?.unsubscribe()

    await Promise.all([
      this.apiRelay.disconnect(),
      this.apiPeople.disconnect(),
      this.apiHub.disconnect(),
    ])
  }

  // Expose subscription manager properties for compatibility
  get subActiveAddress() {
    return this.subscriptionManager.subActiveAddress
  }

  get subImportedAccounts() {
    return this.subscriptionManager.subImportedAccounts
  }

  get subActiveEra() {
    return this.subscriptionManager.subActiveEra
  }

  get subAccountBalances() {
    return this.subscriptionManager.subAccountBalances
  }

  get subBonded() {
    return this.subscriptionManager.subBonded
  }

  get subStakingLedgers() {
    return this.subscriptionManager.subStakingLedgers
  }

  get subActivePoolIds() {
    return this.subscriptionManager.subActivePoolIds
  }

  get subActivePools() {
    return this.subscriptionManager.subActivePools
  }

  get subPoolMemberships() {
    return this.subscriptionManager.subPoolMemberships
  }

  get subProxies() {
    return this.subscriptionManager.subProxies
  }

  get subActiveProxies() {
    return this.subscriptionManager.subActiveProxies
  }

  get subActiveBonded() {
    return this.subscriptionManager.subActiveBonded
  }

  get stakingMetrics() {
    return this.subscriptionManager.stakingMetrics
  }

  get eraRewardPoints() {
    return this.subscriptionManager.eraRewardPoints
  }

  get fastUnstakeQueue() {
    return this.subscriptionManager.fastUnstakeQueue
  }
}
