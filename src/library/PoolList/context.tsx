// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { defaultListFormat, defaultPoolList } from './defaults';
import type { ListFormat, PoolListContextProps } from './types';

export const PoolListContext: React.Context<PoolListContextProps> =
  React.createContext(defaultPoolList);

export const usePoolList = () => React.useContext(PoolListContext);

export const PoolListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
