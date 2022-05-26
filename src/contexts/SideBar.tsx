// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

export interface SideBarContextState {
  openSideBar: () => any;
  closeSideBar: () => any;
  open: number;
}

export const SideBarContext: React.Context<SideBarContextState> =
  React.createContext({
    openSideBar: () => {},
    closeSideBar: () => {},
    open: 0,
  });

export const useSideBar = () => React.useContext(SideBarContext);

export const SideBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(0);

  const openSideBar = () => {
    if (open) return;
    setOpen(1);
  };

  const closeSideBar = () => {
    setOpen(0);
  };

  return (
    <SideBarContext.Provider
      value={{
        openSideBar,
        closeSideBar,
        open,
      }}
    >
      {children}
    </SideBarContext.Provider>
  );
};
