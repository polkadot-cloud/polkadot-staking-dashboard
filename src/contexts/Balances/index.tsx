// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { MaybeAddress } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import * as defaults from './defaults';
import type { BalancesContextInterface, Ledger } from './types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'static/utils';
import { BalancesController } from 'static/BalancesController';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { ActiveBalancesState } from 'contexts/ActiveAccounts/types';

export const BalancesContext = createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => useContext(BalancesContext);

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork();
  const { accounts } = useImportedAccounts();
  const { addExternalAccount } = useExternalAccounts();
  const { addOrReplaceOtherAccount } = useOtherAccounts();
  const { activeAccount, activeProxy, activeProxyRef } = useActiveAccounts();

  // Store active account balances state. Requires Ref for use in event listener callbacks.
  const [activeBalances, setActiveBalances] = useState<ActiveBalancesState>({});
  const activeBalancesRef = useRef(activeBalances);

  // Store whether balances for all imported accounts have been synced.
  const [balancesSynced, setBalancesSynced] = useState<{
    synced: boolean;
    total: number;
  }>({ synced: false, total: 0 });

  // Gets a ledger for a stash address.
  const getStashLedger = (address: MaybeAddress): Ledger =>
    Object.values(BalancesController.ledgers).find(
      (ledger) => ledger['stash'] === address
    ) || defaults.defaultLedger;

  // Gets an account's balance metadata.
  const getBalance = (address: MaybeAddress) => {
    if (address) {
      const maybeBalance = BalancesController.balances[address]?.balance;
      if (maybeBalance) {
        return maybeBalance;
      }
    }
    return defaults.defaultBalance;
  };

  // Gets an account's locks.
  const getLocks = (address: MaybeAddress) => {
    if (address) {
      const maybeLocks = BalancesController.balances[address]?.locks;
      if (maybeLocks) {
        return maybeLocks;
      }
    }
    return [];
  };

  // Gets an account's nonce.
  const getNonce = (address: MaybeAddress) => {
    if (address) {
      const maybeNonce = BalancesController.balances[address]?.nonce;
      if (maybeNonce) {
        return maybeNonce;
      }
    }
    return 0;
  };

  // Handle new external account event being reported from `BalancesController`.
  const newExternalAccountCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const result = addExternalAccount(e.detail.stash, 'system');
      if (result) {
        addOrReplaceOtherAccount(result.account, result.type);
      }
    }
  };

  // Handle new account balance event being reported from `BalancesController`.
  const newAccountBalancesCallback = (e: Event) => {
    if (
      isCustomEvent(e) &&
      BalancesController.isValidNewAccountBalanceEvent(e)
    ) {
      const { address, ...newBalances } = e.detail;

      // Only update state of active accounts.
      // TODO: add check for active controller (also required in UI on a high level).
      if (address === activeAccount || address === activeProxyRef?.address) {
        setStateWithRef(
          { ...activeBalancesRef.current, [address]: newBalances },
          setActiveBalances,
          activeBalancesRef
        );
      }

      // Update whether all account balances have been synced. Uses greater than to account for
      // possible errors on the API side.
      checkBalancesSynced();
    }
  };

  const documentRef = useRef<Document>(document);

  // Update account balances states when active account / active proxy updates.
  //
  // If `BalancesController` does not return an account balances record for an account, the balance
  // has not yet synced. In this case, and a `new-account-balance` event will be emitted when the
  // balance is ready to be sycned with the UI.
  useEffectIgnoreInitial(() => {
    // Adds an active balance record if it exists in `BalancesController`.
    const getActiveBalances = (account: MaybeAddress) => {
      if (account) {
        const accountBalances = BalancesController.getAccountBalances(account);
        if (accountBalances) {
          newActiveBalances[account] = accountBalances;
        }
      }
    };

    // Construct new active balances state.
    const newActiveBalances: ActiveBalancesState = {};
    getActiveBalances(activeAccount);
    getActiveBalances(activeProxy);

    // Commit new active balances to state.
    setActiveBalances(newActiveBalances);
    checkBalancesSynced();
  }, [activeAccount, activeProxy]);

  // Reset state when network changes.
  useEffectIgnoreInitial(() => {
    setActiveBalances({});
  }, [network]);

  // Listen for new external account events.
  useEventListener(
    'new-external-account',
    newExternalAccountCallback,
    documentRef
  );

  // Listen for new account balance events.
  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  );

  const checkBalancesSynced = () => {
    setBalancesSynced({
      synced:
        Object.keys(BalancesController.accounts).length >= accounts.length,
      total: BalancesController.accounts.length,
    });
  };

  return (
    <BalancesContext.Provider
      value={{
        activeBalances,
        getStashLedger,
        getBalance,
        getLocks,
        getNonce,
        balancesSynced,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
