// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { extractUrlValue } from 'Utils';
import { PoolsTabsContextInterface } from '../types';

export const PoolsTabsContext: React.Context<PoolsTabsContextInterface> =
  React.createContext({
    // eslint-disable-next-line
    setActiveTab: (t: number) => {},
    activeTab: 0,
  });

export const usePoolsTabs = () => React.useContext(PoolsTabsContext);

export const PoolsTabsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const tabFromUrl = extractUrlValue('t');
  const initialActiveTab = [0, 1, 2, 3].includes(Number(tabFromUrl))
    ? Number(tabFromUrl)
    : 0;

  const [activeTab, _setActiveTab] = useState<number>(initialActiveTab);

  const setActiveTab = (t: number) => {
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
