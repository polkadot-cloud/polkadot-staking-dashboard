// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkId, Plugin } from 'types'

export const PluginsList: Plugin[] = ['staking_api', 'subscan', 'polkawatch']

// Force plugins to be enabled in production environment
//
// NOTE: If you are forking the staking dashboard and do not wish to enforce a plugin in production,
// you can remove it from this list
export const CompulsoryPluginsProduction: Plugin[] = [
	'staking_api',
	'subscan',
	'polkawatch',
]

// Force plugins to be disabled in production environment on a per-network basis
//
// NOTE: If you are forking the staking dashboard and do not wish to enforce a plugin to be
// disabled, you can remove it from this list
export const DisabledPluginsPerNetwork: Partial<Record<NetworkId, Plugin[]>> = {
	// NOTE: During Kusama asset hub migration, disable the staking API until it is fixed
	kusama: ['staking_api'],
	// NOTE: Westend is not supported by the staking API plugin
	westend: ['staking_api'],
}

export const PolkawatchConfig = {
	ApiVersion: 'v2',
	SupportedNetworks: ['polkadot', 'kusama'],
}
