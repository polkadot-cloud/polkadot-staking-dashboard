// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils'
import type { Plugin } from 'config/plugins'
import { PluginsList } from 'config/plugins'

// Get initial plugins from local storage.
export const getAvailablePlugins = () =>
  localStorageOrDefault('plugins', PluginsList, true) as Plugin[]
