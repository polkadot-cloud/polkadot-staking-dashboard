// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Option } from '@polkadot/types-codec';
import {
  BalanceLedger,
  BalancesAccount,
  BalancesContextInterface,
} from 'contexts/Balances/types';
import { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
import { setStateWithRef } from 'Utils';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import * as defaults from './defaults';

export const BalancesContext = React.createContext<BalancesContextInterface>(
  defaults.defaultBalancesContext
);

export const useBalances = () => React.useContext(BalancesContext);

export const BalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network, consts } = useApi();
  const { accounts: connectAccounts } = useConnect();

  // existential amount of unit for an account
  const existentialAmount = consts.existentialDeposit;

  // balance accounts state
  const [accounts, setAccounts] = useState<Array<BalancesAccount>>([]);
  const accountsRef = useRef(accounts);

  // balance subscriptions state
  const [unsubsBalances, setUnsubsBalances] = useState<AnyApi>([]);
  const unsubsBalancesRef = useRef<AnyApi>(unsubsBalances);

  // account ledgers to separate storage
  const [ledgers, setLedgers] = useState<Array<BalanceLedger>>([]);
  const ledgersRef = useRef(ledgers);

  // ledger subscriptions state
  const [unsubsLedgers, setUnsubsLedgers] = useState<AnyApi>([]);
  const unsubsLedgersRef = useRef<AnyApi>(unsubsLedgers);

  // fetch account balances & ledgers. Remove or add subscriptions
  useEffect(() => {
    if (isReady) {
      // local updated values
      let _accounts = accountsRef.current;
      let _ledgers = ledgersRef.current;
      const _unsubsBalances = unsubsBalancesRef.current;
      const _unsubsLedgers = unsubsLedgersRef.current;

      // get accounts removed: use these to unsubscribe
      const accountsRemoved = accountsRef.current.filter(
        (a: BalancesAccount) =>
          !connectAccounts.find((c: ImportedAccount) => c.address === a.address)
      );
      // get accounts added: use these to subscribe
      const accountsAdded = connectAccounts.filter(
        (c: ImportedAccount) =>
          !accountsRef.current.find(
            (a: BalancesAccount) => a.address === c.address
          )
      );
      // update accounts state for removal
      _accounts = accountsRef.current.filter((a: BalancesAccount) =>
        connectAccounts.find((c: ImportedAccount) => c.address === a.address)
      );
      // update ledgers state for removal
      _ledgers = ledgersRef.current.filter((l: BalanceLedger) =>
        connectAccounts.find((c: ImportedAccount) => c.address === l.address)
      );

      // update accounts state and unsubscribe if accounts have been removed
      if (_accounts.length < accountsRef.current.length) {
        // unsubscribe from removed balances
        accountsRemoved.forEach((a: BalancesAccount) => {
          const unsub = unsubsBalancesRef.current.find(
            (u: AnyApi) => u.key === a.address
          );
          if (unsub) {
            unsub.unsub();
            // remove unsub from balances
            _unsubsBalances.filter((u: AnyApi) => u.key !== a.address);
          }
        });
        // commit state updates
        setStateWithRef(_unsubsBalances, setUnsubsBalances, unsubsBalancesRef);
        setStateWithRef(_accounts, setAccounts, accountsRef);
      }

      // update ledgers state and unsubscribe if accounts have been removed
      if (_ledgers.length < ledgersRef.current.length) {
        // unsubscribe from removed ledgers if it exists
        accountsRemoved.forEach((a: BalancesAccount) => {
          const unsub = unsubsLedgersRef.current.find(
            (u: AnyApi) => u.key === a.address
          );
          if (unsub) {
            unsub.unsub();
            // remove unsub from balances
            _unsubsLedgers.filter((u: AnyApi) => u.key !== a.address);
          }
        });
        // commit state updates
        setStateWithRef(_unsubsLedgers, setUnsubsLedgers, unsubsLedgersRef);
        setStateWithRef(_ledgers, setLedgers, ledgersRef);
      }

      // if accounts have changed, update state with new unsubs / accounts
      if (accountsAdded.length) {
        // subscribe to account balances and ledgers
        handleSubscribe(accountsAdded);
      }
    }
  }, [connectAccounts, network, isReady]);

  // unsubscribe from everything on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, []);

  // subscribe to added accounts
  const handleSubscribe = async (accountsAdded: Array<ImportedAccount>) => {
    // subscribe to balances
    Promise.all(
      accountsAdded.map((a: ImportedAccount) => subscribeToBalances(a.address))
    );
  };

  /*
   * Unsubscrbe all balance subscriptions
   */
  const unsubscribeAll = () => {
    Object.values(unsubsBalancesRef.current).forEach(({ unsub }: AnyApi) => {
      unsub();
    });
    Object.values(unsubsLedgersRef.current).forEach(({ unsub }: AnyApi) => {
      unsub();
    });
  };

  // subscribe to account balances
  const subscribeToBalances = async (address: string) => {
    if (!api) return;

    const unsub: () => void = await api.queryMulti<
      [AnyApi, AnyApi, Option<AnyApi>, Option<AnyApi>]
    >(
      [[api.query.system.account, address]],
      async ([{ data }]): Promise<void> => {
        const _account: BalancesAccount = {
          address,
        };

        // get account balances
        const { free } = data;

        // set account balances to context
        _account.balance = {
          total: free,
        };

        // update account in context state
        let _accounts = Object.values(accountsRef.current);
        // remove stale account if it's already in list
        _accounts = _accounts
          .filter((a: BalancesAccount) => a.address !== address)
          .concat(_account);

        setStateWithRef(_accounts, setAccounts, accountsRef);
      }
    );

    const _unsubs = unsubsBalancesRef.current.concat({
      key: address,
      unsub,
    });
    setStateWithRef(_unsubs, setUnsubsBalances, unsubsBalancesRef);
    return unsub;
  };

  // get an account's balance metadata
  const getAccountBalance = (address: MaybeAccount) => {
    const account = accountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return defaults.balance;
    }
    const { balance } = account;
    if (balance?.total === undefined) {
      return defaults.balance;
    }
    return balance;
  };

  // get a stash account's ledger metadata
  const getLedgerForStash = (address: MaybeAccount) => {
    const ledger = ledgersRef.current.find(
      (l: BalanceLedger) => l.stash === address
    );
    if (ledger === undefined) {
      return defaults.ledger;
    }
    if (ledger.stash === undefined) {
      return defaults.ledger;
    }
    return ledger;
  };

  // get a controler account's ledger
  // returns null if ledger does not exist.
  const getLedgerForController = (address: MaybeAccount) => {
    const ledger = ledgersRef.current.find(
      (l: BalanceLedger) => l.address === address
    );
    if (ledger === undefined) {
      return null;
    }
    if (ledger.address === undefined) {
      return null;
    }
    return ledger;
  };
  // get an account
  const getAccount = (address: MaybeAccount) => {
    const account = accountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return null;
    }
    return account;
  };

  return (
    <BalancesContext.Provider
      value={{
        getAccount,
        getAccountBalance,
        getLedgerForStash,
        getLedgerForController,
        existentialAmount,
        accounts: accountsRef.current,
        ledgers: ledgersRef.current,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
