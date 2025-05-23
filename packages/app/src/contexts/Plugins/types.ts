// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Plugin } from 'types'

export interface PluginsContextInterface {
  togglePlugin: (k: Plugin) => void
  pluginEnabled: (key: Plugin) => boolean
  plugins: Plugin[]
}
