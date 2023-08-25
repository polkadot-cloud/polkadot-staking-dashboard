// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { SideMenuStickyThreshold } from 'consts';
import { useBalances } from 'contexts/Balances';
import type { ImportedAccount } from 'contexts/Connect/types';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { useNetworkMetrics } from '../Network';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import type { UIContextInterface } from './types';

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = useApi();
  const { balances } = useBalances();
  const { staking, eraStakers } = useStaking();
  const { activeEra, metrics } = useNetworkMetrics();
  const { accounts: connectAccounts } = useConnect();
  const { synced: activePoolsSynced } = useActivePools();

  // set whether the network has been synced.
  const [isNetworkSyncing, setIsNetworkSyncing] = useState(false);

  // set whether pools are being synced.
  const [isPoolSyncing, setIsPoolSyncing] = useState(false);

  // set whether app is syncing. Includes workers (active nominations).
  const [isSyncing, setIsSyncing] = useState(false);

  // side menu control
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // get side menu minimised state from local storage, default to false.
  const [userSideMenuMinimised, setUserSideMenuMinimisedState] = useState(
    localStorageOrDefault('side_menu_minimised', false, true) as boolean
  );
  const userSideMenuMinimisedRef = useRef(userSideMenuMinimised);
  const setUserSideMenuMinimised = (v: boolean) => {
    localStorage.setItem('side_menu_minimised', String(v));
    setStateWithRef(v, setUserSideMenuMinimisedState, userSideMenuMinimisedRef);
  };

  // automatic side menu minimised
  const [sideMenuMinimised, setSideMenuMinimised] = useState(
    window.innerWidth <= SideMenuStickyThreshold
      ? true
      : userSideMenuMinimisedRef.current
  );

  // resize side menu callback
  const resizeCallback = () => {
    if (window.innerWidth <= SideMenuStickyThreshold) {
      setSideMenuMinimised(false);
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
  useEffectIgnoreInitial(() => {
    resizeCallback();
  }, [userSideMenuMinimised]);

  // app syncing updates
  useEffect(() => {
    let syncing = false;
    let networkSyncing = false;
    let poolSyncing = false;

    if (!isReady) {
      syncing = true;
      networkSyncing = true;
      poolSyncing = true;
    }
    // staking metrics have synced
    if (staking.lastReward === new BigNumber(0)) {
      syncing = true;
      networkSyncing = true;
      poolSyncing = true;
    }

    // era has synced from Network
    if (activeEra.index.isZero()) {
      syncing = true;
      networkSyncing = true;
      poolSyncing = true;
    }

    // all extension accounts have been synced
    const extensionAccounts = connectAccounts.filter(
      (a: ImportedAccount) => a.source !== 'external'
    );
    if (balances.length < extensionAccounts.length) {
      syncing = true;
      networkSyncing = true;
      poolSyncing = true;
    }

    setIsNetworkSyncing(networkSyncing);

    // active pools have been synced
    if (activePoolsSynced !== 'synced') {
      syncing = true;
      poolSyncing = true;
    }

    setIsPoolSyncing(poolSyncing);

    // eraStakers total active nominators has synced
    if (!eraStakers.totalActiveNominators) {
      syncing = true;
    }

    setIsSyncing(syncing);
  }, [isReady, staking, metrics, balances, eraStakers, activePoolsSynced]);

  const setSideMenu = (v: boolean) => {
    setSideMenuOpen(v);
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
        setContainerRefs,
        sideMenuOpen,
        userSideMenuMinimised: userSideMenuMinimisedRef.current,
        sideMenuMinimised,
        isSyncing,
        isNetworkSyncing,
        isPoolSyncing,
        containerRefs,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const UIContext = React.createContext<UIContextInterface>(
  defaults.defaultUIContext
);

export const useUi = () => React.useContext(UIContext);
