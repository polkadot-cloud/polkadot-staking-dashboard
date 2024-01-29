// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SideMenuStickyThreshold } from 'consts';
import { useBalances } from 'contexts/Balances';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import type { AnyJson } from 'types';
import { useApi } from '../Api';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import type { UIContextInterface } from './types';

export const UIContext = createContext<UIContextInterface>(
  defaults.defaultUIContext
);

export const useUi = () => useContext(UIContext);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const { eraStakers } = useStaking();
  const { balancesInitialSynced } = useBalances();
  const { synced: activePoolsSynced } = useActivePools();
  const { isReady, networkMetrics, activeEra, stakingMetrics } = useApi();

  // Set whether the network has been synced.
  const [isNetworkSyncing, setIsNetworkSyncing] = useState<boolean>(false);

  // Set whether pools are being synced.
  const [isPoolSyncing, setIsPoolSyncing] = useState<boolean>(false);

  // Set whether app is syncing. Includes workers (active nominations).
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Side whether the side menu is open.
  const [sideMenuOpen, setSideMenu] = useState<boolean>(false);

  // Store whether in Brave browser. Used for light client warning.
  const [isBraveBrowser, setIsBraveBrowser] = useState<boolean>(false);

  // Store references for main app containers.
  const [containerRefs, setContainerRefsState] = useState<
    Record<string, RefObject<HTMLDivElement>>
  >({});
  const setContainerRefs = (v: Record<string, RefObject<HTMLDivElement>>) => {
    setContainerRefsState(v);
  };

  // Get side menu minimised state from local storage, default to false.
  const [userSideMenuMinimised, setUserSideMenuMinimisedState] =
    useState<boolean>(
      localStorageOrDefault('side_menu_minimised', false, true) as boolean
    );
  const userSideMenuMinimisedRef = useRef(userSideMenuMinimised);
  const setUserSideMenuMinimised = (v: boolean) => {
    localStorage.setItem('side_menu_minimised', String(v));
    setStateWithRef(v, setUserSideMenuMinimisedState, userSideMenuMinimisedRef);
  };

  // Automatic side menu minimised.
  const [sideMenuMinimised, setSideMenuMinimised] = useState<boolean>(
    window.innerWidth <= SideMenuStickyThreshold
      ? true
      : userSideMenuMinimisedRef.current
  );

  // Resize side menu callback.
  const resizeCallback = () => {
    if (window.innerWidth <= SideMenuStickyThreshold) {
      setSideMenuMinimised(false);
    } else {
      setSideMenuMinimised(userSideMenuMinimisedRef.current);
    }
  };

  // Resize event listener.
  useEffect(() => {
    (window.navigator as AnyJson)?.brave
      ?.isBrave()
      .then(async (isBrave: boolean) => {
        setIsBraveBrowser(isBrave);
      });

    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  // Re-configure minimised on user change.
  useEffectIgnoreInitial(() => {
    resizeCallback();
  }, [userSideMenuMinimised]);

  // App syncing updates.
  useEffect(() => {
    let syncing = false;
    let networkSyncing = false;
    let poolSyncing = false;

    // staking metrics have synced
    if (stakingMetrics.lastReward === new BigNumber(0)) {
      syncing = true;
      networkSyncing = true;
    }

    // era has synced from Network
    if (activeEra.index.isZero()) {
      syncing = true;
      networkSyncing = true;
    }

    if (!balancesInitialSynced) {
      syncing = true;
      networkSyncing = true;
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
  }, [
    isReady,
    stakingMetrics,
    networkMetrics,
    eraStakers,
    activePoolsSynced,
    balancesInitialSynced,
  ]);

  return (
    <UIContext.Provider
      value={{
        setSideMenu,
        setUserSideMenuMinimised,
        setContainerRefs,
        sideMenuOpen,
        sideMenuMinimised,
        isSyncing,
        isNetworkSyncing,
        isPoolSyncing,
        containerRefs,
        isBraveBrowser,
        userSideMenuMinimised,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
