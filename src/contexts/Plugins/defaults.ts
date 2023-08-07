// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PluginsContextInterface } from './types';

export const defaultPluginsContext: PluginsContextInterface = {
  // eslint-disable-next-line
  togglePlugin: (k) => {},
  // eslint-disable-next-line
  pluginEnabled: (k) => false,
  plugins: [],
};
