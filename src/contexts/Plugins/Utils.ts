// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@polkadot-cloud/utils';
import { PluginsList } from 'consts';
import type { Plugin } from 'types';

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
