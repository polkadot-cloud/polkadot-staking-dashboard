// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { MaybeAddress } from 'types';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useExternalAccounts } from 'contexts/Connect/ExternalAccounts';
import { useOtherAccounts } from 'contexts/Connect/OtherAccounts';
import * as defaults from './defaults';
import type { BalancesContextInterface, Ledger } from './types';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'static/utils';
import { BalancesController } from 'static/BalancesController';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useActiveBalances } from 'library/Hooks/useActiveBalances';
import { useBonded } from 'contexts/Bonded';
import { useApi } from 'contexts/Api';

export const BalancesContext = createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => useContext(BalancesContext);

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
  const {
    consts: { existentialDeposit },
  } = useApi();
  const { getBondedAccount } = useBonded();
  const { accounts } = useImportedAccounts();
  const { addExternalAccount } = useExternalAccounts();
  const { addOrReplaceOtherAccount } = useOtherAccounts();
  const { activeAccount, activeProxy } = useActiveAccounts();
  const controller = getBondedAccount(activeAccount);

  // Listen to balance updates for the active account and active proxy.
  const {
    activeBalances,
    getBalanceLocks,
    getActiveBalance,
    getActiveStashLedger,
  } = useActiveBalances({
    existentialDeposit,
    accounts: [activeAccount, activeProxy, controller],
  });

  // Store whether balances for all imported accounts have been synced.
  const [balancesSynced, setBalancesSynced] = useState<boolean>(false);

  // Functions that need deprecating or refactoring --------------------------------

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
  // --------------------------------------------------------------------------------

  // Handle new external account event being reported from `BalancesController`.
  const newExternalAccountCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const result = addExternalAccount(e.detail.stash, 'system');
      if (result) {
        addOrReplaceOtherAccount(result.account, result.type);
      }
    }
  };

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

  const checkBalancesSynced = () => {
    setBalancesSynced(
      Object.keys(BalancesController.balances).length >= accounts.length
    );
  };

  const documentRef = useRef<Document>(document);

  // Listen for new account balance events.
  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  );

  // Listen for new external account events.
  useEventListener(
    'new-external-account',
    newExternalAccountCallback,
    documentRef
  );

  return (
    <BalancesContext.Provider
      value={{
        activeBalances,
        getStashLedger,
        getBalance,
        getLocks,
        getNonce,
        getActiveBalanceLocks: getBalanceLocks,
        getActiveBalance,
        getActiveStashLedger,
        balancesSynced,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
