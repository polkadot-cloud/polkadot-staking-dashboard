// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { DisabledPluginsPerNetwork } from 'consts/plugins'
import { useNetwork } from 'contexts/Network'
import { getAvailablePlugins, plugins$, setPlugins } from 'global-bus'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { Plugin } from 'types'
import type { PluginsContextInterface } from './types'

export const [PluginsContext, usePlugins] =
	createSafeContext<PluginsContextInterface>()

export const PluginsProvider = ({ children }: { children: ReactNode }) => {
	const { network } = useNetwork()

	const { allPlugins, activePlugins } = getAvailablePlugins()

	// Store the currently active plugins
	const [plugins, setPluginsState] = useState<Plugin[]>(activePlugins)

	// Toggle a plugin
	const togglePlugin = (key: Plugin) => {
		const nextAll = allPlugins.includes(key)
			? allPlugins.filter((p) => p !== key)
			: [...allPlugins, key]

		const disabledPlugins = new Set(DisabledPluginsPerNetwork[network] ?? [])
		const nextActive = nextAll.filter((p) => !disabledPlugins.has(p))

		setPlugins(nextAll, nextActive)
	}

	// Check if a plugin is currently enabled
	const pluginEnabled = (key: Plugin) => plugins.includes(key)

	// Subscribe to global bus for plugin changes
	useEffect(() => {
		const sub = plugins$.subscribe((result) => {
			setPluginsState(result)
		})
		return () => {
			sub.unsubscribe()
		}
	}, [])

	// On network change, update available plugins
	useEffect(() => {
		const { allPlugins, activePlugins } = getAvailablePlugins()
		setPlugins(allPlugins, activePlugins)
	}, [network])

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
