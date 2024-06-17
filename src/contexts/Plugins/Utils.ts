// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { Plugin } from 'config/plugins';
import { PluginsList } from 'config/plugins';

// Get initial plugins from local storage.
export const getAvailablePlugins = () => {
  const localPlugins = localStorageOrDefault(
    'plugins',
    PluginsList,
    true
  ) as Plugin[];

  // If fiat is disabled, remove `binance_spot` service.
  const DISABLE_FIAT = Number(import.meta.env.VITE_DISABLE_FIAT ?? 0);
  if (DISABLE_FIAT && localPlugins.includes('binance_spot')) {
    const index = localPlugins.indexOf('binance_spot');
    if (index !== -1) {
      localPlugins.splice(index, 1);
    }
  }

  return localPlugins;
};
