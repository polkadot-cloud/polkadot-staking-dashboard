// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { MaybeAddress } from 'types';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import * as defaults from './defaults';
import type { BalancesContextInterface } from './types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'static/utils';
import { BalancesController } from 'static/BalancesController';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useActiveBalances } from 'library/Hooks/useActiveBalances';
import { useBonded } from 'contexts/Bonded';

export const BalancesContext = createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => useContext(BalancesContext);

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { getBondedAccount } = useBonded();
  const { accounts } = useImportedAccounts();
  const { activeAccount, activeProxy } = useActiveAccounts();
  const controller = getBondedAccount(activeAccount);

  // Listen to balance updates for the active account, active proxy and controller..
  const { activeBalances, getLocks, getBalance, getLedger, getPayee } =
    useActiveBalances({
      accounts: [activeAccount, activeProxy, controller],
    });

  // Store whether balances for all imported accounts have been synced on initial page load.
  const [balancesInitialSynced, setBalancesInitialSynced] =
    useState<boolean>(false);

  // Check all accounts have been synced. App-wide syncing state for all accounts.
  const newAccountBalancesCallback = (e: Event) => {
    if (
      isCustomEvent(e) &&
      BalancesController.isValidNewAccountBalanceEvent(e)
    ) {
      // Update whether all account balances have been synced. Uses greater than to account for
      // possible errors on the API side.
      checkBalancesSynced();
    }
  };

  // Check whether all accounts have been synced and update state accordingly.
  const checkBalancesSynced = () => {
    setBalancesInitialSynced(
      Object.keys(BalancesController.balances).length === accounts.length
    );
  };

  // Gets an account's nonce directly from `BalanceController`. Used at the time of building a
  // payload.
  const getNonce = (address: MaybeAddress) => {
    if (address) {
      const maybeNonce = BalancesController.balances[address]?.nonce;
      if (maybeNonce) {
        return maybeNonce;
      }
    }
    return 0;
  };

  const documentRef = useRef<Document>(document);

  // Listen for new account balance events.
  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  );

  // If no accounts are imported, set balances synced to true.
  useEffect(() => {
    if (!accounts.length) {
      setBalancesInitialSynced(true);
    }
  }, [accounts.length]);

  return (
    <BalancesContext.Provider
      value={{
        activeBalances,
        getNonce,
        getLocks,
        getBalance,
        getLedger,
        getPayee,
        balancesInitialSynced,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
