// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export interface UIContextState {
  setSideMenu: (v: number) => void;
  setListFormat: (v: string) => void;
  setValidatorsOrder: () => void;
  orderValidatorsLowestCommission: () => void;
  sideMenuOpen: number;
  listFormat: string;
  validators: any;
}

export const UIContext: React.Context<UIContextState> = React.createContext({
  setSideMenu: (v: number) => { },
  setListFormat: (v: string) => { },
  setValidatorsOrder: () => { },
  orderValidatorsLowestCommission: () => { },
  sideMenuOpen: 0,
  listFormat: 'col',
  validators: {},
});

export const useUi = () => React.useContext(UIContext);

export const UIContextWrapper = (props: any) => {

  // const { meta } = useStakingMetrics();

  const [state, setState]: any = useState({
    sideMenuOpen: 0,
    listFormat: 'col',
    validators: {
      orderBy: 'default',
    }
  });

  const setSideMenu = (v: number) => {
    setState({ ...state, sideMenuOpen: v });
  }

  const setListFormat = (v: string) => {
    setState({ ...state, listFormat: v });
  }

  const setValidatorsOrder = () => {
    let orderBy = state.validators.orderBy === 'default' ? 'commission' : 'default';
    setState({
      ...state,
      validators: {
        ...state.validators,
        orderBy: orderBy,
      }
    });
  }

  const orderValidatorsLowestCommission = () => {
    // let list: any = [];
    // list.sort((a: any, b: any) => (a.commission < b.commission) ? 1 : -1)
  }

  return (
    <UIContext.Provider value={{
      setSideMenu: setSideMenu,
      setListFormat: setListFormat,
      setValidatorsOrder: setValidatorsOrder,
      orderValidatorsLowestCommission: orderValidatorsLowestCommission,
      sideMenuOpen: state.sideMenuOpen,
      listFormat: state.listFormat,
      validators: state.validators,
    }}>
      {props.children}
    </UIContext.Provider>
  );
}