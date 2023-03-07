// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { defaultLedgerHardwareContext } from './defaults';
import { LedgerHardwareContextInterface } from './types';

export const LedgerHardwareContext =
  React.createContext<LedgerHardwareContextInterface>(
    defaultLedgerHardwareContext
  );

export const useLedgerHardware = () => React.useContext(LedgerHardwareContext);

export const LedgerHardwareProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <LedgerHardwareContext.Provider value={{}}>
      {children}
    </LedgerHardwareContext.Provider>
  );
};
