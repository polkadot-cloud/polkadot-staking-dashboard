// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PluginsList } from 'consts';
import React, { useRef, useState } from 'react';
import { localStorageOrDefault, setStateWithRef } from 'Utils';
import * as defaults from './defaults';
import { PluginsContextInterface } from './types';

export const PluginsContext = React.createContext<PluginsContextInterface>(
  defaults.defaultPluginsContext
);

export const usePlugins = () => React.useContext(PluginsContext);

export const PluginsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // get initial plugins
  const getAvailablePlugins = () => {
    // get plugins config from local storage
    const localPlugins: any = localStorageOrDefault(
      'plugins',
      PluginsList,
      true
    );

    // if fiat is disabled, remove binance_spot service
    const DISABLE_FIAT = Number(process.env.REACT_APP_DISABLE_FIAT ?? 0);
    if (DISABLE_FIAT && localPlugins.includes('binance_spot')) {
      const index = localPlugins.indexOf('binance_spot');
      if (index !== -1) {
        localPlugins.splice(index, 1);
      }
    }
    return localPlugins;
  };

  // plugins
  const [plugins, setPlugins] = useState(getAvailablePlugins());
  const pluginsRef = useRef(plugins);

  /*
   * Plugin toggling
   */
  const togglePlugin = (key: string) => {
    let localPlugins = [...plugins];
    const found = localPlugins.find((item) => item === key);

    if (found) {
      localPlugins = localPlugins.filter((_s) => _s !== key);
    } else {
      localPlugins.push(key);
    }

    localStorage.setItem('plugins', JSON.stringify(localPlugins));
    setStateWithRef(localPlugins, setPlugins, pluginsRef);
  };

  const getPlugins = () => {
    return pluginsRef.current;
  };

  return (
    <PluginsContext.Provider
      value={{
        togglePlugin,
        getPlugins,
        plugins: pluginsRef.current,
      }}
    >
      {children}
    </PluginsContext.Provider>
  );
};
