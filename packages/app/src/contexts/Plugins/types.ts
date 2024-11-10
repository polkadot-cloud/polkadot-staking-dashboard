// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Plugin } from 'config/plugins';

export interface PluginsContextInterface {
  togglePlugin: (k: Plugin) => void;
  pluginEnabled: (key: Plugin) => boolean;
  plugins: Plugin[];
}
