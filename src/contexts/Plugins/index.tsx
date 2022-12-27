// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ServiceList } from 'consts';
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
  // get initial services
  const getAvailableServices = () => {
    // get services config from local storage
    const _services: any = localStorageOrDefault('services', ServiceList, true);

    // if fiat is disabled, remove binance_spot service
    const DISABLE_FIAT = Number(process.env.REACT_APP_DISABLE_FIAT ?? 0);
    if (DISABLE_FIAT && _services.includes('binance_spot')) {
      const index = _services.indexOf('binance_spot');
      if (index !== -1) {
        _services.splice(index, 1);
      }
    }
    return _services;
  };

  // services
  const [services, setServices] = useState(getAvailableServices());
  const servicesRef = useRef(services);

  /*
   * Service toggling
   */
  const toggleService = (key: string) => {
    let _services = [...services];
    const found = _services.find((item) => item === key);

    if (found) {
      _services = _services.filter((_s) => _s !== key);
    } else {
      _services.push(key);
    }

    localStorage.setItem('services', JSON.stringify(_services));
    setStateWithRef(_services, setServices, servicesRef);
  };

  const getServices = () => {
    return servicesRef.current;
  };

  return (
    <PluginsContext.Provider
      value={{
        toggleService,
        getServices,
        services: servicesRef.current,
      }}
    >
      {children}
    </PluginsContext.Provider>
  );
};
