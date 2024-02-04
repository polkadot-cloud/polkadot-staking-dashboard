// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SideMenuStickyThreshold } from 'consts';
import { useBalances } from 'contexts/Balances';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import type { AnyJson } from 'types';
import { useApi } from '../Api';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import type { UIContextInterface } from './types';
import { isCustomEvent } from 'static/utils';
import { SyncController } from 'static/SyncController';
import { useEventListener } from 'usehooks-ts';

export const UIContext = createContext<UIContextInterface>(
  defaults.defaultUIContext
);

export const useUi = () => useContext(UIContext);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const { eraStakers } = useStaking();
  const { balancesInitialSynced } = useBalances();
  const { isReady, networkMetrics, activeEra, stakingMetrics } = useApi();

  // Keep a record of active sync statuses.
  const [syncStatuses, setSyncStatuses] = useState<string[]>([]);
  const syncStatusesRef = useRef(syncStatuses);

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

  // Get a syncing status of a syncing `id`.
  const isSyncingById = (id: string): boolean =>
    syncStatusesRef.current.includes(id);

  // Resize side menu callback.
  const resizeCallback = () => {
    if (window.innerWidth <= SideMenuStickyThreshold) {
      setSideMenuMinimised(false);
    } else {
      setSideMenuMinimised(userSideMenuMinimisedRef.current);
    }
  };

  // Handle new syncing status events.
  //
  // TODO: move this to a hook that components can listen to for sync statuses (for ids they are
  // interested in). This will prevent router re-renders and oly re-render active components that
  // are listening to updates.
  const newSyncStatusCallback = async (e: Event) => {
    if (isCustomEvent(e) && SyncController.isValidSyncStatus(e)) {
      const { id, status } = e.detail;

      if (status === 'syncing') {
        // An item is reported as syncing. Add its `id` to state if not already.
        if (!syncStatusesRef.current.includes(id)) {
          setStateWithRef(
            [...syncStatusesRef.current, id],
            setSyncStatuses,
            syncStatusesRef
          );
        }
      } else if (status === 'complete') {
        // An item is reported to have completed syncing. Remove its `id` from state if present.
        if (syncStatusesRef.current.includes(id)) {
          const newSyncStatuses = syncStatusesRef.current.filter(
            (syncStatus) => syncStatus !== id
          );
          setStateWithRef(newSyncStatuses, setSyncStatuses, syncStatusesRef);
        }
      }
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

    // staking metrics have synced
    if (stakingMetrics.lastReward === new BigNumber(0)) {
      syncing = true;
    }

    // era has synced from Network
    if (activeEra.index.isZero()) {
      syncing = true;
    }
    // ----------------------------------------------------------------------------------

    if (!balancesInitialSynced) {
      syncing = true;
    }

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
    balancesInitialSynced,
  ]);

  const documentRef = useRef<Document>(document);

  // Listen for new active pool events.
  useEventListener('new-sync-status', newSyncStatusCallback, documentRef);

  return (
    <UIContext.Provider
      value={{
        setSideMenu,
        setUserSideMenuMinimised,
        setContainerRefs,
        sideMenuOpen,
        sideMenuMinimised,
        isSyncing,
        containerRefs,
        isBraveBrowser,
        userSideMenuMinimised,
        syncStatuses,
        isSyncingById,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
