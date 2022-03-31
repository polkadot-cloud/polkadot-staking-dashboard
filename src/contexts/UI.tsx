// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export interface UIContextState {
  setSideMenu: (v: number) => void;
  setListFormat: (v: string) => void;
  orderValidators: (v: string) => void;
  filterValidators: (v: string) => void;
  sideMenuOpen: number;
  listFormat: string;
  validators: any;
}

export const UIContext: React.Context<UIContextState> = React.createContext({
  setSideMenu: (v: number) => { },
  setListFormat: (v: string) => { },
  orderValidators: (v: string) => { },
  filterValidators: (v: string) => { },
  sideMenuOpen: 0,
  listFormat: 'col',
  validators: {},
});

export const useUi = () => React.useContext(UIContext);

export const UIContextWrapper = (props: any) => {

  // const { meta } = useStaking();

  const [state, setState]: any = useState({
    sideMenuOpen: 0,
    listFormat: 'col',
    validators: {
      order: 'default',
      filter: ['over_subscribed'],
    }
  });

  const setSideMenu = (v: number) => {
    setState({ ...state, sideMenuOpen: v });
  }

  const setListFormat = (v: string) => {
    setState({ ...state, listFormat: v });
  }

  const setValidatorsOrder = (by: string) => {
    setState({
      ...state, validators: {
        ...state.validators,
        order: by,
      }
    });
  }

  const setValidatorsFilter = (filter: any) => {
    setState({
      ...state, validators: {
        ...state.validators,
        filter: filter,
      }
    });
  }

  // Validator list filtering functions

  const filterValidators = (type: string) => {
    let filter = state.validators.filter;
    let action = state.validators.filter.includes(type) ? 'remove' : 'push';

    filter = action === 'remove'
      ? filter.splice(filter.indexOf(type))
      : filter.push(type);

    let list: any = []; // TODO: fetch default list

    if (filter.includes('over_subscribed')) {
      list = filterOverSubscribed(list);
    }
    if (filter.includes('all_commission')) {
      list = filterAllCommission(list);
    }
    if (filter.includes('blocked_nominations')) {
      list = filterBlockedNominations(list);
    }

    // TODO: apply filtered list

    setValidatorsFilter(filter);
  }

  const filterOverSubscribed = (list: any) => {
    return list;
  }

  const filterAllCommission = (list: any) => {
    return list;
  }

  const filterBlockedNominations = (list: any) => {
    return list;
  }

  // Validator list ordering functions

  const orderValidators = (by: string) => {
    let action = state.validators.order === by ? 'revert' : 'apply';
    // update list
    if (action === 'revert') {
      orderDefault();
    } else {
      orderLowestCommission();
    }
    setValidatorsOrder(action === 'revert' ? 'default' : by);
  }

  const orderLowestCommission = () => {
    // let list: any = [];
    // list.sort((a: any, b: any) => (a.commission < b.commission) ? 1 : -1)
  }

  const orderDefault = () => {
    // fall back to default list
  }

  return (
    <UIContext.Provider value={{
      setSideMenu: setSideMenu,
      setListFormat: setListFormat,
      orderValidators: orderValidators,
      filterValidators: filterValidators,
      sideMenuOpen: state.sideMenuOpen,
      listFormat: state.listFormat,
      validators: state.validators,
    }}>
      {props.children}
    </UIContext.Provider>
  );
}