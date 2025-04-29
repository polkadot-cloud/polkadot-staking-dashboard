// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import { CompulsoryPluginsProduction, PluginsList } from 'consts/plugins'
import type { Plugin } from 'types'

// Get initial plugins from local storage
export const getAvailablePlugins = () => {
  const localPlugins = localStorageOrDefault(
    'plugins',
    PluginsList,
    true
  ) as Plugin[]
  // In production, add compulsory plugins to `localPlugins` if they do not exist.
  if (import.meta.env.PROD) {
    CompulsoryPluginsProduction.forEach((plugin) => {
      if (!localPlugins.includes(plugin)) {
        localPlugins.push(plugin)
      }
    })
  }
  return localPlugins
}
