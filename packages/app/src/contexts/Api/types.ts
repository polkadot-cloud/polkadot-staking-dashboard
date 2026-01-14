// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react'
import type {
	ActiveEra,
	ApiStatus,
	ChainConsts,
	ChainId,
	ChainSpec,
	NetworkId,
	PoolsConfig,
	ProviderType,
	ServiceInterface,
	StakingMetrics,
} from 'types'

export interface APIProviderProps {
	children: ReactNode
	network: NetworkId
}

export interface APIContextInterface {
	getRpcEndpoint: (chain: ChainId) => string
	getApiStatus: (id: ChainId) => ApiStatus
	getChainSpec: (chain: ChainId) => ChainSpec
	getConsts: (chain: ChainId) => ChainConsts
	isReady: boolean
	providerType: ProviderType
	autoRpc: boolean
	activeEra: ActiveEra
	poolsConfig: PoolsConfig
	stakingMetrics: StakingMetrics
	serviceApi: ServiceInterface
}
