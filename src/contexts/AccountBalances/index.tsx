// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import type { TransferOptionsContextInterface } from './types';

/**
 * @name useAccountBalances
 * @summary A provider that subscribes to an account's balances and wrap app children.
 */
export const AccountBalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // TODO: subscribe to account balances.

  return (
    <AccountBalancesContext.Provider value={null}>
      {children}
    </AccountBalancesContext.Provider>
  );
};

/**
 * @name AccountBalancesContext
 * @summary A context that provides an account's balances.
 */
export const AccountBalancesContext =
  React.createContext<TransferOptionsContextInterface>(null);

/**
 * @name useAccountBalances
 * @summary A hook to access the `AccountBalancesContext` provider.
 */
export const useAccountBalances = () =>
  React.useContext(AccountBalancesContext);
