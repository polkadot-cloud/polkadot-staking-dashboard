// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultListFormat, defaultPoolList } from './defaults';
import type { ListFormat, PoolListContextProps } from './types';

export const PoolListContext =
  createContext<PoolListContextProps>(defaultPoolList);

export const usePoolList = () => useContext(PoolListContext);

export const PoolListProvider = ({ children }: { children: ReactNode }) => {
  const [listFormat, setListFormatState] =
    useState<ListFormat>(defaultListFormat);

  const setListFormat = (v: ListFormat) => setListFormatState(v);

  return (
    <PoolListContext.Provider
      value={{
        setListFormat,
        listFormat,
      }}
    >
      {children}
    </PoolListContext.Provider>
  );
};
