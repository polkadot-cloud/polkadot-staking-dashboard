// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DedotClient, SmoldotProvider, WsProvider } from 'dedot'
import {
	defaultSyncStatus,
	removeSyncing,
	setConsts,
	setMultiChainSpecs,
	setSyncingMulti,
} from 'global-bus'
import type {
	NetworkConfig,
	NetworkId,
	ServiceInterface,
	SystemChainId,
} from 'types'
import { CoreConsts } from '../consts/core'
import type { FastUnstakeConsts } from '../consts/fastUnstake'
import { StakingConsts } from '../consts/staking'
import { ApiStatus } from '../spec/apiStatus'
import { ChainSpecs } from '../spec/chainSpecs'
import { ActiveEraQuery } from '../subscribe/activeEra'
import { BlockNumberQuery } from '../subscribe/blockNumber'
import type { FastUnstakeConfigQuery } from '../subscribe/fastUnstakeConfig'
import { PoolsConfigQuery } from '../subscribe/poolsConfig'
import { RelayMetricsQuery } from '../subscribe/relayMetrics'
import type {
	AssetHubChain,
	FastUnstakeChain,
	PeopleChain,
	RelayChain,
	StakingChain,
} from '../types'
import { IdentityManager } from './identityManager'
import { SubscriptionManager } from './subscriptionManager'

// Base service utility that handles common initialization and management
export class BaseService<
	RelayApi extends RelayChain,
	PeopleApi extends PeopleChain,
	HubApi extends AssetHubChain,
	StakingApi extends StakingChain,
	FastUnstakeApi extends FastUnstakeChain,
> {
	// Chain specs of live apis
	relayChainSpec: ChainSpecs<RelayApi>
	hubChainSpec: ChainSpecs<HubApi>

	// API status of live apis
	apiStatus: {
		relay: ApiStatus<RelayApi>
		hub: ApiStatus<HubApi>
	}

	// Constants
	coreConsts: CoreConsts<RelayApi>
	stakingConsts: StakingConsts<StakingApi>
	fastUnstakeConsts: FastUnstakeConsts<FastUnstakeApi>

	// Query objects
	blockNumber: BlockNumberQuery<RelayApi>
	activeEra: ActiveEraQuery<StakingApi>
	relayMetrics: RelayMetricsQuery<RelayApi>
	poolsConfig: PoolsConfigQuery<StakingApi>
	fastUnstakeConfig: FastUnstakeConfigQuery<FastUnstakeApi>

	// Subscription manager
	subscriptionManager: SubscriptionManager<
		RelayApi,
		PeopleApi,
		HubApi,
		StakingApi,
		FastUnstakeApi
	>

	// Identity manager
	identityManager: IdentityManager<PeopleApi>

	constructor(
		public networkConfig: NetworkConfig,
		public ids: [NetworkId, SystemChainId, SystemChainId],
		public apiRelay: DedotClient<RelayApi>,
		public apiHub: DedotClient<HubApi>,
		private stakingApi: DedotClient<StakingApi>,
		private fastUnstakeApi: DedotClient<FastUnstakeApi>,
		public providerPeople: WsProvider | SmoldotProvider,
	) {
		this.apiStatus = {
			relay: new ApiStatus(this.apiRelay, ids[0], networkConfig),
			hub: new ApiStatus(this.apiHub, ids[2], networkConfig),
		}
	}

	// Standard getLiveApi implementation used by all services
	getLiveApi = (id: string) => {
		if (id === this.ids[0]) {
			return this.apiRelay
		} else {
			return this.apiHub
		}
	}

	// Initialize the service with common setup logic
	async start(serviceInterface: ServiceInterface) {
		// Initialize chain specs
		this.relayChainSpec = new ChainSpecs(this.apiRelay)
		this.hubChainSpec = new ChainSpecs(this.apiHub)

		// Initialize constants
		this.coreConsts = new CoreConsts(this.apiRelay)
		this.stakingConsts = new StakingConsts(this.stakingApi)

		// Set default sync status
		setSyncingMulti(defaultSyncStatus)

		// Fetch chain specs
		await Promise.all([this.relayChainSpec.fetch(), this.hubChainSpec.fetch()])

		// Set multi-chain specs and constants
		setMultiChainSpecs({
			[this.ids[0]]: this.relayChainSpec.get(),
			[this.ids[2]]: this.hubChainSpec.get(),
		})
		setConsts(this.ids[0], {
			...this.coreConsts.get(),
			...this.stakingConsts.get(),
			...this.fastUnstakeConsts.get(),
		})

		// Initialize query objects
		this.blockNumber = new BlockNumberQuery(this.apiRelay)
		this.activeEra = new ActiveEraQuery(this.stakingApi)
		this.relayMetrics = new RelayMetricsQuery(this.apiRelay)
		this.poolsConfig = new PoolsConfigQuery(this.stakingApi)

		// Initialize subscription manager
		this.subscriptionManager = new SubscriptionManager(
			this.apiRelay,
			this.apiHub,
			this.stakingApi,
			this.fastUnstakeApi,
			this.ids,
			{ poolsPalletId: this.stakingConsts.poolsPalletId },
			serviceInterface,
		)

		// Initialize identity manager
		this.identityManager = new IdentityManager(this.providerPeople, this.ids[0])

		// Set up the active era subscription
		this.subscriptionManager.setActiveEraSubscription(this.activeEra.activeEra$)

		// Initialize all dynamic subscriptions
		this.subscriptionManager.initialize()

		removeSyncing('initialization')
	}

	// Common unsubscribe logic
	async unsubscribe() {
		await this.subscriptionManager.unsubscribe()

		this.blockNumber?.unsubscribe()
		this.relayMetrics?.unsubscribe()
		this.poolsConfig?.unsubscribe()
		this.fastUnstakeConfig?.unsubscribe()
		this.activeEra?.unsubscribe()

		try {
			await Promise.all([
				this.apiRelay.disconnect(),
				this.identityManager.api ? this.identityManager.api.disconnect() : Promise.resolve(),
				this.apiHub.disconnect(),
			])
		} catch {
			// Silent disconnect error. Move on to network reset and rely on garbage collection
		}
	}

	// Expose subscription manager properties for compatibility with the default service interface
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
