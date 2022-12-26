// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { ServiceList, SideMenuStickyThreshold } from 'consts';
import { ImportedAccount } from 'contexts/Connect/types';
import { useActivePools } from 'contexts/Pools/ActivePools';
import React, { useEffect, useRef, useState } from 'react';
import { localStorageOrDefault, setStateWithRef } from 'Utils';
import { useApi } from '../Api';
import { useBalances } from '../Balances';
import { useConnect } from '../Connect';
import { useNetworkMetrics } from '../Network';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import { UIContextInterface } from './types';

export const UIContext = React.createContext<UIContextInterface>(
  defaults.defaultUIContext
);

export const useUi = () => React.useContext(UIContext);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = useApi();
  const { accounts: connectAccounts } = useConnect();
  const { staking, eraStakers } = useStaking();
  const { metrics } = useNetworkMetrics();
  const { accounts } = useBalances();
  const { synced: activePoolsSynced } = useActivePools();

  // set whether the network has been synced.
  const [networkSyncing, setNetworkSyncing] = useState(false);

  // set whether pools are being synced.
  const [poolsSyncing, setPoolsSyncing] = useState(false);

  // set whether app is syncing.ncludes workers (active nominations).
  const [isSyncing, setIsSyncing] = useState(false);

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

  // get side menu minimised state from local storage, default to not
  const _userSideMenuMinimised = Number(
    localStorageOrDefault('side_menu_minimised', 0)
  );

  // side menu control
  const [sideMenuOpen, setSideMenuOpen] = useState(0);

  // side menu minimised
  const [userSideMenuMinimised, _setUserSideMenuMinimised] = useState(
    _userSideMenuMinimised
  );
  const userSideMenuMinimisedRef = useRef(userSideMenuMinimised);
  const setUserSideMenuMinimised = (v: number) => {
    localStorage.setItem('side_menu_minimised', String(v));
    setStateWithRef(v, _setUserSideMenuMinimised, userSideMenuMinimisedRef);
  };

  // automatic side menu minimised
  const [sideMenuMinimised, setSideMenuMinimised] = useState(
    window.innerWidth <= SideMenuStickyThreshold
      ? 1
      : userSideMenuMinimisedRef.current
  );

  // services
  const [services, setServices] = useState(getAvailableServices());
  const servicesRef = useRef(services);

  // resize side menu callback
  const resizeCallback = () => {
    if (window.innerWidth <= SideMenuStickyThreshold) {
      setSideMenuMinimised(0);
    } else {
      setSideMenuMinimised(userSideMenuMinimisedRef.current);
    }
  };

  // resize event listener
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  // re-configure minimised on user change
  useEffect(() => {
    resizeCallback();
  }, [userSideMenuMinimised]);

  // app syncing updates
  useEffect(() => {
    let _syncing = false;
    let _networkSyncing = false;
    let _poolsSyncing = false;

    if (!isReady) {
      _syncing = true;
      _networkSyncing = true;
      _poolsSyncing = true;
    }
    // staking metrics have synced
    if (staking.lastReward === new BN(0)) {
      _syncing = true;
      _networkSyncing = true;
      _poolsSyncing = true;
    }

    // era has synced from Network
    if (metrics.activeEra.index === 0) {
      _syncing = true;
      _networkSyncing = true;
      _poolsSyncing = true;
    }

    // all extension accounts have been synced
    const extensionAccounts = connectAccounts.filter(
      (a: ImportedAccount) => a.source !== 'external'
    );
    if (accounts.length < extensionAccounts.length) {
      _syncing = true;
      _networkSyncing = true;
      _poolsSyncing = true;
    }

    setNetworkSyncing(_networkSyncing);

    // active pools have been synced
    if (activePoolsSynced !== 'synced') {
      _syncing = true;
      _poolsSyncing = true;
    }

    setPoolsSyncing(_poolsSyncing);

    // eraStakers total active nominators has synced
    if (!eraStakers.totalActiveNominators) {
      _syncing = true;
    }

    setIsSyncing(_syncing);
  }, [isReady, staking, metrics, accounts, eraStakers, activePoolsSynced]);

  const setSideMenu = (v: number) => {
    setSideMenuOpen(v);
  };

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

  const [containerRefs, _setContainerRefs] = useState({});
  const setContainerRefs = (v: any) => {
    _setContainerRefs(v);
  };

  return (
    <UIContext.Provider
      value={{
        setSideMenu,
        setUserSideMenuMinimised,
        toggleService,
        getServices,
        setContainerRefs,
        sideMenuOpen,
        userSideMenuMinimised: userSideMenuMinimisedRef.current,
        sideMenuMinimised,
        services: servicesRef.current,
        isSyncing,
        networkSyncing,
        poolsSyncing,
        containerRefs,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
