// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { SERVICES, SIDE_MENU_STICKY_THRESHOLD } from 'consts';
import { localStorageOrDefault, setStateWithRef } from 'Utils';
import { ConnectContextInterface, ImportedAccount } from 'types/connect';
import { MaybeAccount } from 'types';
import { useConnect } from './Connect';
import { useNetworkMetrics } from './Network';
import { useStaking } from './Staking';
import { useValidators } from './Validators';
import { useBalances } from './Balances';
import { useApi } from './Api';

export interface UIContextState {
  setSideMenu: (v: number) => void;
  setUserSideMenuMinimised: (v: number) => void;
  orderValidators: (v: string) => void;
  applyValidatorOrder: (l: any, o: string) => any;
  applyValidatorFilters: (l: any, k: string, f?: any) => void;
  toggleFilterValidators: (v: string, l: any) => void;
  toggleAllValidatorFilters: (t: number) => void;
  resetValidatorFilters: () => void;
  toggleService: (k: string) => void;
  getSetupProgress: (a: MaybeAccount) => any;
  getSetupProgressPercent: (a: string) => any;
  setActiveAccountSetup: (p: any) => any;
  setActiveAccountSetupSection: (s: number) => void;
  getServices: () => void;
  setOnSetup: (v: any) => void;
  sideMenuOpen: number;
  userSideMenuMinimised: number;
  sideMenuMinimised: number;
  services: any;
  validatorFilters: any;
  validatorOrder: string;
  onSetup: number;
  isSyncing: any;
}

export const UIContext: React.Context<UIContextState> = React.createContext({
  setSideMenu: (v: number) => {},
  setUserSideMenuMinimised: (v: number) => {},
  orderValidators: (v: string) => {},
  applyValidatorOrder: (l: any, o: string) => {},
  applyValidatorFilters: (l: any, k: string, f?: any) => {},
  toggleFilterValidators: (v: string, l: any) => {},
  toggleAllValidatorFilters: (t: number) => {},
  resetValidatorFilters: () => {},
  toggleService: (k: string) => {},
  getSetupProgress: (a: MaybeAccount) => {},
  getSetupProgressPercent: (a: string) => {},
  setActiveAccountSetup: (p: any) => {},
  setActiveAccountSetupSection: (s: number) => {},
  getServices: () => {},
  setOnSetup: (v: any) => {},
  sideMenuOpen: 0,
  userSideMenuMinimised: 0,
  sideMenuMinimised: 0,
  services: [],
  validatorFilters: [],
  validatorOrder: 'default',
  onSetup: 0,
  isSyncing: false,
});

export const useUi = () => React.useContext(UIContext);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const { isReady, consts, network } = useApi();
  const { accounts: connectAccounts, activeAccount } =
    useConnect() as ConnectContextInterface;
  const { staking, eraStakers, inSetup } = useStaking();
  const { meta, session } = useValidators();
  const { maxNominatorRewardedPerValidator } = consts;
  const { metrics } = useNetworkMetrics();
  const { accounts } = useBalances();

  // set whether app is syncing
  const [isSyncing, setIsSyncing] = useState(false);

  // get initial services
  const getAvailableServices = () => {
    // get services config from local storage
    const _services: any = localStorageOrDefault('services', SERVICES, true);

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
  const _userSideMenuMinimised: any = Number(
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
    window.innerWidth <= SIDE_MENU_STICKY_THRESHOLD
      ? 1
      : userSideMenuMinimisedRef.current
  );

  // is the user actively on the setup page
  const [onSetup, setOnSetup] = useState(0);

  // services
  const [services, setServices] = useState(getAvailableServices());
  const servicesRef = useRef(services);

  // validator filtering
  const [validatorFilters, setValidatorFilters]: any = useState([]);

  // validator ordering
  const [validatorOrder, setValidatorOrder]: any = useState('default');

  // staking setup persist
  const [setup, setSetup]: any = useState([]);
  const setupRef = useRef<any>(setup);

  // resize side menu callback
  const resizeCallback = () => {
    if (window.innerWidth <= SIDE_MENU_STICKY_THRESHOLD) {
      setSideMenuMinimised(0);
    } else {
      setSideMenuMinimised(userSideMenuMinimisedRef.current);
    }
  };

  // go to active page once staking setup completes / network change
  useEffect(() => {
    if (!inSetup()) {
      setOnSetup(0);
    }
  }, [inSetup(), network]);

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

  // update setup state when activeAccount changes
  useEffect(() => {
    if (connectAccounts.length) {
      const _setup = setupDefault();
      setStateWithRef(_setup, setSetup, setupRef);
    }
  }, [activeAccount, network, connectAccounts]);

  // app syncing updates
  useEffect(() => {
    let syncing = false;

    if (!isReady) {
      syncing = true;
    }
    // staking metrics have synced
    if (staking.lastReward === new BN(0)) {
      syncing = true;
    }

    // era has synced from Network
    if (metrics.activeEra.index === 0) {
      syncing = true;
    }

    // all extension accounts have been synced
    const extensionAccounts = connectAccounts.filter(
      (a: ImportedAccount) => a.source !== 'external'
    );
    if (accounts.length < extensionAccounts.length) {
      syncing = true;
    }

    // eraStakers has synced
    if (!eraStakers.activeNominators) {
      syncing = true;
    }

    setIsSyncing(syncing);
  }, [isReady, staking, metrics, accounts, eraStakers]);

  const setSideMenu = (v: number) => {
    setSideMenuOpen(v);
  };

  const setValidatorsOrder = (by: string) => {
    setValidatorOrder(by);
  };

  const setValidatorsFilter = (filter: any) => {
    setValidatorFilters(filter);
  };

  // Validator list filtering functions

  const toggleAllValidatorFilters = (toggle: number) => {
    if (toggle) {
      setValidatorsFilter([
        'all_commission',
        'blocked_nominations',
        'over_subscribed',
        'missing_identity',
        'inactive',
      ]);
    } else {
      setValidatorFilters([]);
    }
  };

  const toggleFilterValidators = (f: string) => {
    const filter = [...validatorFilters];
    const action = filter.includes(f) ? 'remove' : 'push';

    if (action === 'remove') {
      const index = filter.indexOf(f);
      filter.splice(index, 1);
    } else {
      filter.push(f);
    }
    setValidatorsFilter(filter);
  };

  const applyValidatorFilters = (
    list: any,
    batchKey: string,
    filter: any = validatorFilters
  ) => {
    if (filter.includes('all_commission')) {
      list = filterAllCommission(list);
    }
    if (filter.includes('blocked_nominations')) {
      list = filterBlockedNominations(list);
    }
    if (filter.includes('over_subscribed')) {
      list = filterOverSubscribed(list, batchKey);
    }
    if (filter.includes('missing_identity')) {
      list = filterMissingIdentity(list, batchKey);
    }
    if (filter.includes('inactive')) {
      list = filterInactive(list);
    }
    return list;
  };

  const resetValidatorFilters = () => {
    setValidatorFilters([]);
    setValidatorOrder('default');
  };

  const filterMissingIdentity = (list: any, batchKey: string) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    const filteredList: any = [];
    for (const validator of list) {
      const addressBatchIndex =
        meta[batchKey].addresses?.indexOf(validator.address) ?? -1;

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1) {
        filteredList.push(validator);
        continue;
      }

      const identities = meta[batchKey]?.identities ?? [];
      const supers = meta[batchKey]?.supers ?? [];

      // push validator if sync has not completed
      if (!identities.length || !supers.length) {
        filteredList.push(validator);
      }

      const identityExists = identities[addressBatchIndex] ?? null;
      const superExists = supers[addressBatchIndex] ?? null;

      // validator included if identity or super identity has been set
      if (identityExists !== null || superExists !== null) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  };

  const filterOverSubscribed = (list: any, batchKey: string) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    const filteredList: any = [];
    for (const validator of list) {
      const addressBatchIndex =
        meta[batchKey].addresses?.indexOf(validator.address) ?? -1;

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1) {
        filteredList.push(validator);
        continue;
      }
      const stake = meta[batchKey]?.stake ?? false;
      if (!stake) {
        filteredList.push(validator);
        continue;
      }
      const totalNominations = stake[addressBatchIndex].total_nominations ?? 0;
      if (totalNominations < maxNominatorRewardedPerValidator) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  };

  const filterAllCommission = (list: any) => {
    list = list.filter(
      (validator: any) => validator?.prefs?.commission !== 100
    );
    return list;
  };

  const filterBlockedNominations = (list: any) => {
    list = list.filter((validator: any) => validator?.prefs?.blocked !== true);
    return list;
  };

  const filterInactive = (list: any) => {
    // if list has not yet been populated, return original list
    if (session.list.length === 0) {
      return list;
    }
    list = list.filter((validator: any) =>
      session.list.includes(validator.address)
    );
    return list;
  };

  // Validator list ordering functions

  const orderValidators = (by: string) => {
    const order = validatorOrder === by ? 'default' : by;
    setValidatorsOrder(order);
  };

  const applyValidatorOrder = (list: any, order: string) => {
    if (order === 'commission') {
      return orderLowestCommission(list);
    }
    return list;
  };

  const orderLowestCommission = (list: any) => {
    const orderedList = [...list].sort(
      (a: any, b: any) => a.prefs.commission - b.prefs.commission
    );
    return orderedList;
  };

  // Setup helper functions

  const PROGRESS_DEFAULT = {
    controller: null,
    payee: null,
    nominations: [],
    bond: 0,
    section: 1,
  };

  /*
   * Generates the default setup objects or the currently
   * connected accounts.
   */
  const setupDefault = () => {
    // generate setup objects from connected accounts
    const _setup = connectAccounts.map((item: any) => {
      // if there is existing config for an account, use that.
      const localSetup = localStorage.getItem(
        `${network.name.toLowerCase()}_stake_setup_${item.address}`
      );

      // otherwise use the default values.
      const progress =
        localSetup !== null ? JSON.parse(localSetup) : PROGRESS_DEFAULT;

      return {
        address: item.address,
        progress,
      };
    });
    return _setup;
  };

  /*
   * Gets the setup progress for a connected account.
   */
  const getSetupProgress = (address: MaybeAccount) => {
    // find the current setup progress from `setup`.
    const _setup = setupRef.current.find(
      (item: any) => item.address === address
    );

    if (_setup === undefined) {
      return PROGRESS_DEFAULT;
    }
    return _setup.progress;
  };

  const getSetupProgressPercent = (address: string) => {
    const setupProgress = getSetupProgress(address);
    const p = 25;
    let progress = 0;
    if (setupProgress.bond > 0) progress += p;
    if (setupProgress.controller !== null) progress += p;
    if (setupProgress.nominations.length) progress += p;
    if (setupProgress.payee !== null) progress += p;

    return progress;
  };

  /*
   * Sets setup progress for an address
   */
  const setActiveAccountSetup = (progress: any) => {
    if (!activeAccount) return;

    // update local storage setup
    localStorage.setItem(
      `${network.name.toLowerCase()}_stake_setup_${activeAccount}`,
      JSON.stringify(progress)
    );

    // update context setup
    const _setup = setupRef.current.map((obj: any) =>
      obj.address === activeAccount
        ? {
            ...obj,
            progress,
          }
        : obj
    );
    setStateWithRef(_setup, setSetup, setupRef);
  };

  /*
   * Sets active setup section for an address
   */
  const setActiveAccountSetupSection = (section: number) => {
    if (!activeAccount) return;

    // get current progress
    const _accountSetup = [...setupRef.current].find(
      (item: any) => item.address === activeAccount
    );

    // abort if setup does not exist
    if (_accountSetup === null) {
      return;
    }
    // amend section
    _accountSetup.progress.section = section;

    // update context setup
    const _setup = setupRef.current.map((obj: any) =>
      obj.address === activeAccount ? _accountSetup : obj
    );

    // update local storage
    localStorage.setItem(
      `${network.name.toLowerCase()}_stake_setup_${activeAccount}`,
      JSON.stringify(_accountSetup.progress)
    );

    // update context
    setStateWithRef(_setup, setSetup, setupRef);
  };

  /*
   * Service toggling
   */
  const toggleService = (key: string) => {
    let _services: any = [...services];
    const found = _services.find((item: any) => item === key);

    if (found) {
      _services = _services.filter((_s: any) => _s !== key);
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
    <UIContext.Provider
      value={{
        setSideMenu,
        setUserSideMenuMinimised,
        orderValidators,
        applyValidatorOrder,
        applyValidatorFilters,
        resetValidatorFilters,
        toggleFilterValidators,
        toggleAllValidatorFilters,
        toggleService,
        getSetupProgress,
        getSetupProgressPercent,
        setActiveAccountSetup,
        setActiveAccountSetupSection,
        getServices,
        setOnSetup,
        sideMenuOpen,
        userSideMenuMinimised: userSideMenuMinimisedRef.current,
        sideMenuMinimised,
        validatorFilters,
        validatorOrder,
        services: servicesRef.current,
        onSetup,
        isSyncing,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
