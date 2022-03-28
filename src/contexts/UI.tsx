// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export interface UIContextState {
  setSideMenu: (v: number) => void;
  setListFormat: (v: string) => void;
  sideMenuOpen: number;
  listFormat: string;
}

export const UIContext: React.Context<UIContextState> = React.createContext({
  setSideMenu: (v: number) => { },
  setListFormat: (v: string) => { },
  sideMenuOpen: 0,
  listFormat: 'col',
});

export const useUi = () => React.useContext(UIContext);

export const UIContextWrapper = (props: any) => {

  const [state, setState]: any = useState({
    sideMenuOpen: 0,
    listFormat: 'col',
  });

  const setSideMenu = (v: number) => {
    setState({
      ...state,
      sideMenuOpen: v
    });
  }

  const setListFormat = (v: string) => {
    setState({
      ...state,
      listFormat: v,
    });
  }

  return (
    <UIContext.Provider value={{
      setSideMenu: setSideMenu,
      setListFormat: setListFormat,
      sideMenuOpen: state.sideMenuOpen,
      listFormat: state.listFormat,
    }}>
      {props.children}
    </UIContext.Provider>
  );
}