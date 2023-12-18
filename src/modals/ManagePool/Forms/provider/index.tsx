// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext } from 'react';
import type {
  PoolCommissionContextInterface,
  PoolCommissionProviderProps,
} from './types';

export const PoolCommissionContext =
  createContext<PoolCommissionContextInterface>(null);

export const usePoolCommission = () => useContext(PoolCommissionContext);

export const PoolCommissionProvider = ({
  children,
}: PoolCommissionProviderProps) => {
  return (
    <PoolCommissionContext.Provider value={{ someVal: 'someVal' }}>
      {children}
    </PoolCommissionContext.Provider>
  );
};
