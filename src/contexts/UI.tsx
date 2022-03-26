// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export interface UIContextState {
  setSideMenu: (v: number) => void;
  sideMenuOpen: number;
}

export const UIContext: React.Context<UIContextState> = React.createContext({
  setSideMenu: (v: number) => { },
  sideMenuOpen: 0,
});

export const useUi = () => React.useContext(UIContext);

export const UIContextWrapper = (props: any) => {

  const [state, setState]: any = useState({
    sideMenuOpen: 0,
  });

  const setSideMenu = (v: number) => {
    setState({
      sideMenuOpen: v
    });
  }

  return (
    <UIContext.Provider value={{
      setSideMenu: setSideMenu,
      sideMenuOpen: state.sideMenuOpen,
    }}>
      {props.children}
    </UIContext.Provider>
  );
}