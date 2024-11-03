// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import { setStateWithRef } from '@w3ux/utils';
import type {
  ActiveBalancesState,
  ActiveLedgerSource,
} from 'contexts/Balances/types';
import { useNetwork } from 'contexts/Network';
import { useEffect, useRef, useState } from 'react';
import { BalancesController } from 'controllers/Balances';
import { isCustomEvent } from 'controllers/utils';
import { useEventListener } from 'usehooks-ts';
import BigNumber from 'bignumber.js';
import {
  defaultBalance,
  defaultLedger,
  defaultPayee,
} from 'controllers/Balances/defaults';
import type { PayeeConfig } from 'contexts/Setup/types';
import type { PoolMembership } from 'contexts/Pools/types';
import type {
  BalanceLock,
  BalanceLocks,
  Ledger,
  Targets,
} from 'model/Subscribe/Balance/types';

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
  const getBalance = (address: MaybeAddress) => {
    if (address) {
      const maybeBalance = activeBalances[address]?.balances.balance;
      if (maybeBalance) {
        return maybeBalance;
      }
    }
    return defaultBalance;
  };

  // Gets the largest lock balance, dictating the total amount of unavailable funds from locks.
  const getMaxLock = (locks: BalanceLock[]): BigNumber =>
    locks.reduce(
      (prev, current) =>
        prev.amount.isGreaterThan(current.amount) ? prev : current,
      { amount: new BigNumber(0) }
    )?.amount || new BigNumber(0);

  // Gets an active balance's locks.
  const getLocks = (address: MaybeAddress): BalanceLocks => {
    if (address) {
      const maybeLocks = activeBalances[address]?.balances.locks;
      if (maybeLocks) {
        return { locks: maybeLocks, maxLock: getMaxLock(maybeLocks) };
      }
    }

    return {
      locks: [],
      maxLock: new BigNumber(0),
    };
  };

  // Gets a ledger for a stash address.
  const getLedger = (source: ActiveLedgerSource): Ledger => {
    if ('stash' in source) {
      const stash = source['stash'];
      return (
        Object.values(activeBalances).find(
          (activeBalance) => activeBalance.ledger?.stash === stash
        )?.ledger || defaultLedger
      );
    }
    if ('key' in source) {
      const key = source['key'];
      if (key) {
        return activeBalances[key]?.ledger || defaultLedger;
      }
    }
    return defaultLedger;
  };

  // Gets an active balance's payee.
  const getPayee = (address: MaybeAddress): PayeeConfig => {
    if (address) {
      const maybePayee = activeBalances[address]?.payee;
      if (maybePayee) {
        return maybePayee;
      }
    }
    return defaultPayee;
  };

  // Gets an active balance's pool membership.
  const getPoolMembership = (address: MaybeAddress): PoolMembership | null => {
    if (address) {
      const maybePoolMembership = activeBalances[address]?.poolMembership;
      if (maybePoolMembership) {
        return maybePoolMembership;
      }
    }
    return null;
  };

  // Gets the amount of balance reserved for existential deposit.
  const getEdReserved = (
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ): BigNumber => {
    const { locks, maxLock } = getLocks(address);
    if (address && locks) {
      return BigNumber.max(existentialDeposit.minus(maxLock), 0);
    }
    return new BigNumber(0);
  };

  // Gets an active balance's nominations.
  const getNominations = (address: MaybeAddress): Targets => {
    if (address) {
      const maybeNominations =
        activeBalances[address]?.nominations?.targets || [];
      if (maybeNominations) {
        return maybeNominations;
      }
    }
    return [];
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

  // Update account balances states on initial render.
  //
  // If `BalancesController` does not return an account balances record for an account, the balance
  // has not yet synced or the provided account is still `null`. In these cases a
  // `new-account-balance` event will be emitted when the balance is ready to be sycned with the UI.
  useEffect(() => {
    // Construct new active balances state.
    const newActiveBalances: ActiveBalancesState = {};

    for (const account of uniqueAccounts) {
      // Adds an active balance record if it exists in `BalancesController`.
      if (account) {
        const accountBalances = BalancesController.getAccountBalances(
          network,
          account
        );
        if (accountBalances) {
          newActiveBalances[account] = accountBalances;
        }
      }
    }
    // Commit new active balances to state.
    setStateWithRef(newActiveBalances, setActiveBalances, activeBalancesRef);
  }, [JSON.stringify(uniqueAccounts)]);

  // Reset state when network changes.
  useEffectIgnoreInitial(() => {
    setStateWithRef({}, setActiveBalances, activeBalancesRef);
  }, [network]);

  // Listen for new account balance events.
  const documentRef = useRef<Document>(document);

  useEventListener(
    'new-account-balance',
    newAccountBalancesCallback,
    documentRef
  );

  return {
    activeBalances,
    getLocks,
    getBalance,
    getLedger,
    getPayee,
    getPoolMembership,
    getEdReserved,
    getNominations,
  };
};
