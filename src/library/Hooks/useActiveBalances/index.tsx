// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@polkadot-cloud/react';
import type { MaybeAddress } from '@polkadot-cloud/react/types';
import { setStateWithRef } from '@polkadot-cloud/utils';
import type { ActiveBalancesState } from 'contexts/ActiveAccounts/types';
import { useNetwork } from 'contexts/Network';
import { useEffect, useRef, useState } from 'react';
import { BalancesController } from 'static/BalancesController';
import { isCustomEvent } from 'static/utils';
import { useEventListener } from 'usehooks-ts';
import { defaultActiveBalance, defaultLedger } from './defaults';
import type { Ledger } from 'contexts/Balances/types';
import { getMaxLock } from 'contexts/Balances/Utils';
import BigNumber from 'bignumber.js';

export const useActiveBalances = ({
  accounts,
}: {
  accounts: MaybeAddress[];
}) => {
  const { network } = useNetwork();

  // Ensure no account duplicates.
  const uniqueAccounts = [...new Set(accounts)];

  // Store active account balances state. Requires ref for use in event listener callbacks.
  const [activeBalances, setActiveBalances] = useState<ActiveBalancesState>({});
  const activeBalancesRef = useRef(activeBalances);

  // Gets an active balance's balance.
  const getActiveBalance = (address: MaybeAddress) => {
    if (address) {
      const maybeBalance = activeBalances[address]?.balances.balance;
      if (maybeBalance) {
        return maybeBalance;
      }
    }
    return defaultActiveBalance;
  };

  // Gets an active balance's locks.
  const getBalanceLocks = (address: MaybeAddress) => {
    if (address) {
      const maybeLocks = activeBalances[address]?.balances.locks;
      if (maybeLocks) {
        return maybeLocks;
      }
    }
    return [];
  };

  // Gets a ledger for a stash address.
  const getActiveStashLedger = (address: MaybeAddress): Ledger =>
    Object.values(activeBalances).find(
      (activeBalance) => activeBalance.ledger['stash'] === address
    )?.ledger || defaultLedger;

  // Gets the amount of balance reserved for existential deposit.
  const getEdReserved = (
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ): BigNumber => {
    const locks = getBalanceLocks(address);
    if (address && locks) {
      const maxLock = getMaxLock(locks);
      return BigNumber.max(existentialDeposit.minus(maxLock), 0);
    }
    return new BigNumber(0);
  };

  // Handle new account balance event being reported from `BalancesController`.
  const newAccountBalancesCallback = (e: Event) => {
    if (
      isCustomEvent(e) &&
      BalancesController.isValidNewAccountBalanceEvent(e)
    ) {
      const { address, ...newBalances } = e.detail;

      // Only update state of active accounts.
      if (uniqueAccounts.includes(address)) {
        setStateWithRef(
          { ...activeBalancesRef.current, [address]: newBalances },
          setActiveBalances,
          activeBalancesRef
        );
      }
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for new account balance events.
  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  );

  // Update account balances states on initial render.
  //
  // If `BalancesController` does not return an account balances record for an account, the balance
  // has not yet synced or the provided account is still `null`. In these cases a
  // `new-account-balance` event will be emitted when the balance is ready to be sycned with the UI.
  useEffect(() => {
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
    for (const account of uniqueAccounts) {
      getActiveBalances(account);
    }
    // Commit new active balances to state.
    setStateWithRef(newActiveBalances, setActiveBalances, activeBalancesRef);
  }, [JSON.stringify(uniqueAccounts)]);

  // Reset state when network changes.
  useEffectIgnoreInitial(() => {
    setStateWithRef({}, setActiveBalances, activeBalancesRef);
  }, [network]);

  return {
    activeBalances,
    getBalanceLocks,
    getActiveBalance,
    getActiveStashLedger,
    getEdReserved,
  };
};
