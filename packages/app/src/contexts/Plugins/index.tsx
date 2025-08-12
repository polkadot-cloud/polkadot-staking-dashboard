// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { getAvailablePlugins, plugins$, setPlugins } from 'global-bus'
import { Subscan } from 'library/Subscan'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { Plugin } from 'types'
import type { PluginsContextInterface } from './types'

export const [PluginsContext, usePlugins] =
	createSafeContext<PluginsContextInterface>()

export const PluginsProvider = ({ children }: { children: ReactNode }) => {
	const { network } = useNetwork()
	const { isReady, activeEra } = useApi()
	const { activeAddress } = useActiveAccounts()

	// Store the currently active plugins
	const [plugins, setPluginsState] = useState<Plugin[]>(getAvailablePlugins())

	// Toggle a plugin
	const togglePlugin = (key: Plugin) => {
		let newPlugins = [...plugins]
		const found = newPlugins.find((p) => p === key)
		if (found) {
			newPlugins = newPlugins.filter((p) => p !== key)
		} else {
			newPlugins.push(key)
		}
		setPlugins(newPlugins)
	}

	// Check if a plugin is currently enabled
	const pluginEnabled = (key: Plugin) => plugins.includes(key)

	// Reset payouts on Subscan plugin not enabled. Otherwise fetch payouts
	useEffectIgnoreInitial(() => {
		if (plugins.includes('subscan')) {
			Subscan.network = network
		}
	}, [plugins.includes('subscan'), isReady, network, activeAddress, activeEra])

	// Subscribe to global bus for plugin changes
	useEffect(() => {
		const sub = plugins$.subscribe((result) => {
			setPluginsState(result)
		})
		return () => {
			sub.unsubscribe()
		}
	}, [])

	return (
		<PluginsContext.Provider
			value={{
				togglePlugin,
				pluginEnabled,
				plugins,
			}}
		>
			{children}
		</PluginsContext.Provider>
	)
}
