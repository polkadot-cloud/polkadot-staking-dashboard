// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PluginsContextInterface } from './types';

export const defaultPluginsContext: PluginsContextInterface = {
  // eslint-disable-next-line
  togglePlugin: (k) => {},
  getPlugins: () => [],
  plugins: [],
};
