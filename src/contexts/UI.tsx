// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useConnect } from './Connect';
import { useNetworkMetrics } from './Network';
import { useStaking } from './Staking';
import { useBalances } from './Balances';
import { useApi } from './Api';
import { SERVICES } from '../constants';

export interface UIContextState {
  setSideMenu: (v: number) => void;
  setListFormat: (v: string) => void;
  orderValidators: (v: string) => void;
  applyValidatorOrder: (l: any, o: string) => any;
  applyValidatorFilters: (l: any, k: string, f?: any) => void;
  toggleFilterValidators: (v: string, l: any) => void;
  isSyncing: () => any;
  toggleService: (k: string) => void;
  getSetup: (a: string) => any;
  setActiveAccountSetup: (p: any) => any;
  setActiveAccountSetupSection: (s: number) => void;
  sideMenuOpen: number;
  listFormat: string;
  validators: any;
  services: any;
}

export const UIContext: React.Context<UIContextState> = React.createContext({
  setSideMenu: (v: number) => { },
  setListFormat: (v: string) => { },
  orderValidators: (v: string) => { },
  applyValidatorOrder: (l: any, o: string) => { },
  applyValidatorFilters: (l: any, k: string, f?: any) => { },
  toggleFilterValidators: (v: string, l: any) => { },
  isSyncing: () => false,
  toggleService: (k: string) => { },
  getSetup: (a: string) => { },
  setActiveAccountSetup: (p: any) => { },
  setActiveAccountSetupSection: (s: number) => { },
  sideMenuOpen: 0,
  listFormat: 'col',
  validators: {},
  services: SERVICES,
});

export const useUi = () => React.useContext(UIContext);

export const UIContextWrapper = (props: any) => {

  const { accounts: connectAccounts, activeAccount } = useConnect();
  const { meta, session, staking, eraStakers }: any = useStaking();
  const { isReady, consts }: any = useApi();
  const { maxNominatorRewardedPerValidator } = consts;
  const { metrics }: any = useNetworkMetrics();
  const { accounts }: any = useBalances();

  let _services: any = localStorage.getItem('services');
  if (_services === null) {
    _services = SERVICES;
  } else {
    _services = JSON.parse(_services);
  }

  // side menu control
  const [sideMenuOpen, setSideMenuOpen] = useState(0);

  // global list format
  const [listFormat, _setListFormat] = useState('col');

  // services
  const [services, setServices] = useState(_services);

  // validator filtering
  const [validators, setValidators]: any = useState({
    order: 'default',
    filter: [],
  });

  // staking setup persist
  const [setup, setSetup]: any = useState([]);

  // update setup state when activeAccount changes
  useEffect(() => {
    const _setup = setupDefault();
    setSetup(_setup);
  }, [activeAccount]);


  const setSideMenu = (v: number) => {
    setSideMenuOpen(v);
  }

  const setListFormat = (v: string) => {
    _setListFormat(v);
  }

  const setValidatorsOrder = (by: string) => {
    let _validators: any = Object.assign({}, validators);
    _validators.order = by;
    setValidators(_validators);
  }

  const setValidatorsFilter = (filter: any) => {
    setValidators({
      ...validators,
      filter: filter,
    });
  }

  // Validator list filtering functions

  const toggleFilterValidators = (f: string) => {
    let filter = Object.assign(validators.filter);
    let action = validators.filter.includes(f) ? 'remove' : 'push';

    if (action === 'remove') {
      let index = filter.indexOf(f);
      filter.splice(index, 1);
    } else {
      filter.push(f);
    }
    setValidatorsFilter(filter);
  }

  const applyValidatorFilters = (list: any, batchKey: string, filter: any = validators.filter) => {

    if (filter.includes('all_commission')) {
      list = filterAllCommission(list);
    }
    if (filter.includes('blocked_nominations')) {
      list = filterBlockedNominations(list);
    }
    if (filter.includes('over_subscribed')) {
      list = filterOverSubscribed(list, batchKey);
    }
    if (filter.includes('inactive')) {
      list = filterInactive(list);
    }
    return list;
  }

  const filterOverSubscribed = (list: any, batchKey: string) => {
    if (meta[batchKey] === undefined) {
      return list;
    }
    let filteredList: any = [];
    for (let validator of list) {
      let addressBatchIndex = meta[batchKey].addresses?.indexOf(validator.address) ?? -1;

      // if we cannot derive data, fallback to include validator in filtered list
      if (addressBatchIndex === -1) {
        filteredList.push(validator);
        continue;
      }
      let stake = meta[batchKey]?.stake ?? false;
      if (!stake) {
        filteredList.push(validator);
        continue;
      }
      let totalNominations = stake[addressBatchIndex].total_nominations ?? 0;
      if (totalNominations < maxNominatorRewardedPerValidator) {
        filteredList.push(validator);
        continue;
      }
    }
    return filteredList;
  }

  const filterAllCommission = (list: any) => {
    list = list.filter((validator: any) => validator?.prefs?.commission !== 100);
    return list;
  }

  const filterBlockedNominations = (list: any) => {
    list = list.filter((validator: any) => validator?.prefs?.blocked !== true);
    return list;
  }

  const filterInactive = (list: any) => {
    // if list has not yet been populated, return original list
    if (session.list.length === 0) {
      return list;
    }
    list = list.filter((validator: any) => session.list.includes(validator.address));
    return list;
  }

  // Validator list ordering functions

  const orderValidators = (by: string) => {
    let order = validators.order === by
      ? 'default'
      : by;
    setValidatorsOrder(order);
  }

  const applyValidatorOrder = (list: any, order: string) => {
    if (order === 'commission') {
      return orderLowestCommission(list);
    }
    return list;
  }

  const orderLowestCommission = (list: any) => {
    let orderedList = [...list].sort((a: any, b: any) => (a.prefs.commission - b.prefs.commission));
    return orderedList;
  }

  /*
   * Helper function to determine whether the dashboard is still
   * fetching remote data.
   */
  const isSyncing = () => {

    // api not ready
    if (!isReady) {
      return true;
    }

    // staking metrics have synced
    if (staking.lastReward === 0) {
      return true;
    }

    // era has synced from Network
    if (metrics.activeEra.index === 0) {
      return true;
    }

    // all accounts have been synced
    if (accounts.length < connectAccounts.length) {
      return true;
    }

    // eraStakers has synced
    if (!eraStakers.activeNominators) {
      return true;
    }

    return false;
  }

  // Setup helper functions

  /* 
   * Generates the default setup objects or the currently
   * connected accounts.
   */
  const setupDefault = () => {

    // generate setup objects from connected accounts
    const _setup = connectAccounts.map((item: any) => {

      // if there is existing config for an account, use that.
      const localSetup = localStorage.getItem(`stake_setup_${item.address}`);

      // otherwise use the default values.
      const progress = localSetup !== null
        ? JSON.parse(localSetup)
        : {
          controller: null,
          payee: null,
          nominations: [],
          bond: 0,
          section: 1,
        };

      return {
        address: item.address,
        progress: progress,
      }
    });
    return _setup;
  }

  /*
   * Gets the setup progress for a connected account.
   */
  const getSetup = (address: string) => {

    // find the current setup progress from `setup`.
    const _setup = setup.find((item: any) => item.address === address);

    if (_setup === undefined) {
      return null;
    }
    return _setup;
  }

  /*
   * Sets setup progress for an address
   */
  const setActiveAccountSetup = (progress: any) => {

    // update local storage setup
    localStorage.setItem(`stake_setup_${activeAccount}`, JSON.stringify(progress));

    // update context setup
    const _setup = setup.map((obj: any) =>
      obj.address === activeAccount ? {
        ...obj,
        progress: progress
      } : obj
    );
    setSetup(_setup);
  }

  /*
   * Sets active setup section for an address
   */
  const setActiveAccountSetupSection = (section: number) => {

    // get current progress
    const _accountSetup = [...setup].find((item: any) => item.address === activeAccount);

    // abort if setup does not exist
    if (_accountSetup === null) {
      return;
    }
    // amend section
    _accountSetup.progress.section = section;

    // update context setup
    const _setup = setup.map((obj: any) => obj.address === activeAccount ? _accountSetup : obj);

    // update local storage
    localStorage.setItem(`stake_setup_${activeAccount}`, JSON.stringify(_accountSetup.progress));

    // update context
    setSetup(_setup);
  }

  /*
   * Service toggling 
   */
  const toggleService = (key: string) => {

    let _services: any = Object.assign(services);

    if (_services.find((item: any) => item === key)) {
      _services = _services.filter((_s: any) => _s !== key);
    } else {
      _services.push(key);
    }

    localStorage.setItem('services', JSON.stringify(_services));
    setServices(_services);
  }

  return (
    <UIContext.Provider value={{
      setSideMenu: setSideMenu,
      setListFormat: setListFormat,
      orderValidators: orderValidators,
      applyValidatorOrder: applyValidatorOrder,
      applyValidatorFilters: applyValidatorFilters,
      toggleFilterValidators: toggleFilterValidators,
      isSyncing: isSyncing,
      toggleService: toggleService,
      getSetup: getSetup,
      setActiveAccountSetup: setActiveAccountSetup,
      setActiveAccountSetupSection: setActiveAccountSetupSection,
      sideMenuOpen: sideMenuOpen,
      listFormat: listFormat,
      validators: validators,
      services: services,
    }}>
      {props.children}
    </UIContext.Provider>
  );
}