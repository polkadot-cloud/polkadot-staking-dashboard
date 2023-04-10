// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { localStorageOrDefault, setStateWithRef } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { SideMenuStickyThreshold } from 'consts';
import type { ImportedAccount } from 'contexts/Connect/types';
import { useActivePools } from 'contexts/Pools/ActivePools';
import React, { useEffect, useRef, useState } from 'react';
import { useBalances } from '../Accounts/Balances';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { useNetworkMetrics } from '../Network';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import type { SyncStart, UIContextInterface } from './types';

export const UIContext = React.createContext<UIContextInterface>(
  defaults.defaultUIContext
);

export const useUi = () => React.useContext(UIContext);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = useApi();
  const { accounts: connectAccounts } = useConnect();
  const { staking, eraStakers } = useStaking();
  const { activeEra, metrics } = useNetworkMetrics();
  const { balances } = useBalances();
  const { synced: activePoolsSynced } = useActivePools();

  // set whether the network has been synced.
  const [isNetworkSyncing, setIsNetworkSyncing] = useState(false);

  // set whether pools are being synced.
  const [isPoolSyncing, setIsPoolSyncing] = useState(false);

  // set whether app is syncing.ncludes workers (active nominations).
  const [isSyncing, setIsSyncing] = useState(false);

  // store sync start times.
  const [syncStarts, setSyncStarts] = useState<Array<SyncStart>>([]);

  // gets the id of a sync
  const getSyncById = (id: string) => {
    const existing = syncStarts.find((s: SyncStart) => s.id === id);
    return existing?.start || null;
  };

  // get a sync start for an id
  const getSyncStart = (id: string) => {
    const existing = syncStarts.find((s: SyncStart) => s.id === id);
    return existing?.start || 0;
  };

  // set a sync start time for an id.
  const setSyncStart = (id: string, start: number | null) => {
    setSyncStarts([
      {
        id,
        start,
        synced: false,
      },
    ]);
  };

  // get whether a syncStart has been synced. Fall back to true if not existing.
  const getSyncSynced = (id: string) => {
    const existing = [...syncStarts].find((s: SyncStart) => s.id === id);
    return existing?.synced || false;
  };

  // set whether a syncStart has been synced.
  const setSyncSynced = (id: string) => {
    const existing = [...syncStarts].find((s: SyncStart) => s.id === id);
    if (existing) {
      setSyncStarts(
        [...syncStarts]
          .filter((s: SyncStart) => s.id !== id)
          .concat({
            ...existing,
            synced: true,
          })
      );
    }
  };

  // side menu control
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // get side menu minimised state from local storage, default to 0.
  const [userSideMenuMinimised, setUserSideMenuMinimisedState] = useState(
    Number(localStorageOrDefault('side_menu_minimised', 0))
  );
  const userSideMenuMinimisedRef = useRef(userSideMenuMinimised);
  const setUserSideMenuMinimised = (v: number) => {
    localStorage.setItem('side_menu_minimised', String(v));
    setStateWithRef(v, setUserSideMenuMinimisedState, userSideMenuMinimisedRef);
  };

  // automatic side menu minimised
  const [sideMenuMinimised, setSideMenuMinimised] = useState(
    window.innerWidth <= SideMenuStickyThreshold
      ? 1
      : userSideMenuMinimisedRef.current
  );

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
        getSyncById,
        getSyncStart,
        setSyncStart,
        getSyncSynced,
        setSyncSynced,
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
