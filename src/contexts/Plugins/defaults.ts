// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { PluginsContextInterface } from './types';

export const defaultPluginsContext: PluginsContextInterface = {
  togglePlugin: (k) => {},
  pluginEnabled: (k) => false,
  plugins: [],
};
