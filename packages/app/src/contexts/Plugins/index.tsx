// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext, useEffectIgnoreInitial } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import { ErasRewardPoints } from 'api/subscribe/erasRewardPoints'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Subscan } from 'controllers/Subscan'
import { Subscriptions } from 'controllers/Subscriptions'
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
  const { activeAccount } = useActiveAccounts()

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
  }, [plugins.includes('subscan'), isReady, network, activeAccount, activeEra])

  // Handle api subscriptions when Staking API is toggled
  useEffectIgnoreInitial(() => {
    const currentEraRewardPointsSub = Subscriptions.get(
      network,
      'erasRewardPoints'
    )
    // On staking api disable, or on era change, initialise fallback subscriptions for era reward
    // points
    if (!pluginEnabled('staking_api') && !activeEra.index.isZero() && isReady) {
      // Unsubscribe to staking metrics if it exists.
      if (currentEraRewardPointsSub) {
        currentEraRewardPointsSub.unsubscribe()
        Subscriptions.remove(network, 'erasRewardPoints')
      }
      // Subscribe to eras reward points for current era
      Subscriptions.set(
        network,
        'erasRewardPoints',
        new ErasRewardPoints(network, activeEra.index.toNumber())
      )
    }
    // If Staking API is enabled, unsubscribe from eras reward points
    if (pluginEnabled('staking_api')) {
      if (currentEraRewardPointsSub) {
        currentEraRewardPointsSub.unsubscribe()
        Subscriptions.remove(network, 'erasRewardPoints')
      }
    }
  }, [isReady, activeEra, pluginEnabled('staking_api')])

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
