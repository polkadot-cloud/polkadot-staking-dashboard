// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// List of available plugins.
export type Plugin = 'staking_api' | 'subscan' | 'tips' | 'polkawatch'

// Force plugins to always be enabled in production environment. NOTE: If you are forking the
// staking dashboard and do not wish to use a plugin, you can remove it from this list.
export const CompulsoryPluginsProd: Plugin[] = ['staking_api']

export const PluginsList: Plugin[] = [
  'staking_api',
  'subscan',
  'tips',
  'polkawatch',
]
