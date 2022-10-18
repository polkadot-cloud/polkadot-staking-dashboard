// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { PoolsTabsContextInterface } from '../types';

export const PoolsTabsContext: React.Context<PoolsTabsContextInterface> =
  React.createContext({
    setActiveTab: (t: number) => {},
    activeTab: 0,
  });

export const usePoolsTabs = () => React.useContext(PoolsTabsContext);

export const PoolsTabsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, _setActiveTab] = useState<number>(0);

  const setActiveTab = (t: any) => {
    _setActiveTab(t);
  };

  return (
    <PoolsTabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </PoolsTabsContext.Provider>
  );
};
