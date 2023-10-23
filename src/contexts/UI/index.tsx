// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault, setStateWithRef } from '@polkadot-cloud/utils';
import BigNumber from 'bignumber.js';
import React, { useEffect, useRef, useState } from 'react';
import { MaxEraRewardPointsEras, SideMenuStickyThreshold } from 'consts';
import { useBalances } from 'contexts/Balances';
import type { ImportedAccount } from '@polkadot-cloud/react/types';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import Worker from 'workers/poolRewards?worker';
import { useNetwork } from 'contexts/Network';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import type { AnyJson } from 'types';
import { useApi } from '../Api';
import { useNetworkMetrics } from '../NetworkMetrics';
import { useStaking } from '../Staking';
import * as defaults from './defaults';
import type { UIContextInterface } from './types';

const worker = new Worker();

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    networkData: { endpoints },
  } = useNetwork();
  const { balances } = useBalances();
  const { bondedPools } = useBondedPools();
  const { isReady, isLightClient } = useApi();
  const { staking, eraStakers } = useStaking();
  const { activeEra, metrics } = useNetworkMetrics();
  const { synced: activePoolsSynced } = useActivePools();
  const { accounts: connectAccounts } = useImportedAccounts();
  const { erasRewardPointsFetched, erasRewardPoints } = useValidators();

  // set whether the network has been synced.
  const [isNetworkSyncing, setIsNetworkSyncing] = useState(false);

  // set whether pools are being synced.
  const [isPoolSyncing, setIsPoolSyncing] = useState(false);

  // set whether app is syncing. Includes workers (active nominations).
  const [isSyncing, setIsSyncing] = useState(false);

  // side menu control
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  // Store pool reward points data
  const [poolRewardPoints, setPoolRewardPoints] = useState<AnyJson>({});

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

  const [containerRefs, setContainerRefsState] = useState({});
  const setContainerRefs = (v: any) => {
    setContainerRefsState(v);
  };

  // handle worker message on completed exposure check.
  worker.onmessage = (message: MessageEvent) => {
    if (message) {
      const { data } = message;
      const { task } = data;
      // eslint-disable-next-line
      if (task !== 'processNominationPoolsRewardData') return;

      const { poolRewardData } = data;
      setPoolRewardPoints(poolRewardData);
    }
  };

  // Trigger worker to calculate pool reward data for garaphs once active era, era reward points and
  // bonded pools have been fetched.
  useEffectIgnoreInitial(() => {
    if (
      bondedPools.length &&
      activeEra.index.isGreaterThan(0) &&
      erasRewardPointsFetched === 'synced'
    ) {
      worker.postMessage({
        task: 'processNominationPoolsRewardData',
        activeEra: activeEra.index.toString(),
        bondedPools: bondedPools.map((b) => b.addresses.stash),
        endpoints,
        isLightClient,
        erasRewardPoints,
        maxEras: MaxEraRewardPointsEras,
      });
    }
  }, [bondedPools, activeEra, erasRewardPointsFetched]);

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
        poolRewardPoints,
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
