// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Subscan } from 'controllers/Subscan'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import type { Plugin } from 'types'
import type { PluginsContextInterface } from './types'
import { getAvailablePlugins } from './Utils'

export const [PluginsContext, usePlugins] =
  createSafeContext<PluginsContextInterface>()

export const PluginsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { isReady, activeEra } = useApi()
  const { activeAddress } = useActiveAccounts()

  // Store the currently active plugins
  const [plugins, setPlugins] = useState<Plugin[]>(getAvailablePlugins())
  const pluginsRef = useRef(plugins)

  // Toggle a plugin
  const togglePlugin = (key: Plugin) => {
    let localPlugins = [...plugins]
    const found = localPlugins.find((p) => p === key)

    if (found) {
      localPlugins = localPlugins.filter((p) => p !== key)
    } else {
      localPlugins.push(key)
    }

    localStorage.setItem('plugins', JSON.stringify(localPlugins))
    setStateWithRef(localPlugins, setPlugins, pluginsRef)
  }

  // Check if a plugin is currently enabled
  const pluginEnabled = (key: Plugin) => pluginsRef.current.includes(key)

  // Reset payouts on Subscan plugin not enabled. Otherwise fetch payouts
  useEffectIgnoreInitial(() => {
    if (plugins.includes('subscan')) {
      Subscan.network = network
    }
  }, [plugins.includes('subscan'), isReady, network, activeAddress, activeEra])

  return (
    <PluginsContext.Provider
      value={{
        togglePlugin,
        pluginEnabled,
        plugins: pluginsRef.current,
      }}
    >
      {children}
    </PluginsContext.Provider>
  )
}
