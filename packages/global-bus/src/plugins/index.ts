// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Plugin } from 'types'
import { _plugins } from './private'

export const plugins$ = _plugins.asObservable()

export const getPlugins = () => _plugins.getValue()

export const setPlugins = (plugins: Plugin[]) => {
  localStorage.setItem('plugins', JSON.stringify(plugins))
  _plugins.next(plugins)
}

export const pluginEnabled = (key: Plugin) => _plugins.getValue().includes(key)

export * from './local'
