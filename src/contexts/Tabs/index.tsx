// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { extractUrlValue } from '@polkadotcloud/utils';
import React, { useState } from 'react';
import type { TabsContextInterface } from './types';

export const TabsContext: React.Context<TabsContextInterface> =
  React.createContext({
    // eslint-disable-next-line
    setActiveTab: (t: number) => {},
    activeTab: 0,
  });

export const useTabs = () => React.useContext(TabsContext);

export const TabsProvider = ({ children }: { children: React.ReactNode }) => {
  const tabFromUrl = extractUrlValue('t');
  const initialActiveTab = [0, 1, 2, 3].includes(Number(tabFromUrl))
    ? Number(tabFromUrl)
    : 0;

  const [activeTab, _setActiveTab] = useState<number>(initialActiveTab);

  const setActiveTab = (t: number) => {
    _setActiveTab(t);
  };

  return (
    <TabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
