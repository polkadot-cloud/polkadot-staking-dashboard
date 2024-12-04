// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// List of available plugins.
export type Plugin = 'staking_api' | 'subscan' | 'tips' | 'polkawatch'

export const PluginsList: Plugin[] = [
  'staking_api',
  'subscan',
  'tips',
  'polkawatch',
]
