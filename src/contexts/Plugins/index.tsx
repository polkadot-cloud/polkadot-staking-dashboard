// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault, setStateWithRef } from '@polkadot-cloud/utils';
import React, { useRef, useState } from 'react';
import { PluginsList } from 'consts';
import type { Plugin } from 'types';
import * as defaults from './defaults';
import type { PluginsContextInterface } from './types';

export const PluginsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Get initial plugins from local storage.
  const getAvailablePlugins = () => {
    const localPlugins = localStorageOrDefault(
      'plugins',
      PluginsList,
      true
    ) as Plugin[];

    // if fiat is disabled, remove binance_spot service
    const DISABLE_FIAT = Number(import.meta.env.VITE_DISABLE_FIAT ?? 0);
    if (DISABLE_FIAT && localPlugins.includes('binance_spot')) {
      const index = localPlugins.indexOf('binance_spot');
      if (index !== -1) localPlugins.splice(index, 1);
    }
    return localPlugins;
  };

  // Store the currently active plugins.
  const [plugins, setPlugins] = useState<Plugin[]>(getAvailablePlugins());
  const pluginsRef = useRef(plugins);

  // Toggle a plugin.
  const togglePlugin = (key: Plugin) => {
    let localPlugins = [...plugins];
    const found = localPlugins.find((p) => p === key);

    if (found) {
      localPlugins = localPlugins.filter((p) => p !== key);
    } else {
      localPlugins.push(key);
    }

    localStorage.setItem('plugins', JSON.stringify(localPlugins));
    setStateWithRef(localPlugins, setPlugins, pluginsRef);
  };

  // Check if a plugin is currently enabled.
  const pluginEnabled = (key: Plugin) => pluginsRef.current.includes(key);

  return (
    <PluginsContext.Provider
      value={{
        togglePlugin,
        pluginEnabled,
        plugins: pluginsRef.current,
      }}
    >
      {children}
    </PluginsContext.Provider>
  );
};

export const PluginsContext = React.createContext<PluginsContextInterface>(
  defaults.defaultPluginsContext
);

export const usePlugins = () => React.useContext(PluginsContext);
