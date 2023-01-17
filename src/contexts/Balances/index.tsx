// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import {
  BalanceLedger,
  BalancesAccount,
  BalancesContextInterface,
} from 'contexts/Balances/types';
import { ImportedAccount } from 'contexts/Connect/types';
import React, { useEffect, useRef, useState } from 'react';
import { AnyApi, MaybeAccount } from 'types';
import { rmCommas, setStateWithRef } from 'Utils';
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
  const { accounts: connectAccounts, addExternalAccount } = useConnect();

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
      let newAccounts = accountsRef.current;
      let newLedgers = ledgersRef.current;
      const newUnsubsBalances = unsubsBalancesRef.current;
      const newUnsubsLedgers = unsubsLedgersRef.current;

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
      newAccounts = accountsRef.current.filter((a: BalancesAccount) =>
        connectAccounts.find((c: ImportedAccount) => c.address === a.address)
      );
      // update ledgers state for removal
      newLedgers = ledgersRef.current.filter((l: BalanceLedger) =>
        connectAccounts.find((c: ImportedAccount) => c.address === l.address)
      );

      // update accounts state and unsubscribe if accounts have been removed
      if (newAccounts.length < accountsRef.current.length) {
        // unsubscribe from removed balances
        accountsRemoved.forEach((a: BalancesAccount) => {
          const unsub = unsubsBalancesRef.current.find(
            (u: AnyApi) => u.key === a.address
          );
          if (unsub) {
            unsub.unsub();
            // remove unsub from balances
            newUnsubsBalances.filter((u: AnyApi) => u.key !== a.address);
          }
        });
        // commit state updates
        setStateWithRef(
          newUnsubsBalances,
          setUnsubsBalances,
          unsubsBalancesRef
        );
        setStateWithRef(newAccounts, setAccounts, accountsRef);
      }

      // update ledgers state and unsubscribe if accounts have been removed
      if (newLedgers.length < ledgersRef.current.length) {
        // unsubscribe from removed ledgers if it exists
        accountsRemoved.forEach((a: BalancesAccount) => {
          const unsub = unsubsLedgersRef.current.find(
            (u: AnyApi) => u.key === a.address
          );
          if (unsub) {
            unsub.unsub();
            // remove unsub from balances
            newUnsubsLedgers.filter((u: AnyApi) => u.key !== a.address);
          }
        });
        // commit state updates
        setStateWithRef(newUnsubsLedgers, setUnsubsLedgers, unsubsLedgersRef);
        setStateWithRef(newLedgers, setLedgers, ledgersRef);
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
    // subscribe to ledgers
    Promise.all(
      accountsAdded.map((a: ImportedAccount) => subscribeToLedger(a.address))
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

  // subscribe to account balances, ledger, bonded and nominators
  const subscribeToBalances = async (address: string) => {
    if (!api) return;

    const unsub = await api.queryMulti<AnyApi>(
      [
        [api.query.system.account, address],
        [api.query.balances.locks, address],
        [api.query.staking.bonded, address],
        [api.query.staking.nominators, address],
      ],
      async ([{ data }, locks, bonded, nominations]): Promise<void> => {
        const newAccount: BalancesAccount = {
          address,
        };
        const free = new BigNumber(data.free.toString());
        const reserved = new BigNumber(data.reserved.toString());
        const miscFrozen = new BigNumber(data.miscFrozen.toString());
        const feeFrozen = new BigNumber(data.feeFrozen.toString());
        const freeAfterReserve = BigNumber.max(
          free.minus(existentialAmount),
          new BigNumber(0)
        );

        // set account balances to context
        newAccount.balance = {
          free,
          reserved,
          miscFrozen,
          feeFrozen,
          freeAfterReserve,
        };

        // get account locks
        const _locks = locks.toHuman();
        for (let i = 0; i < _locks.length; i++) {
          _locks[i].amount = new BigNumber(rmCommas(_locks[i].amount));
        }
        newAccount.locks = _locks;

        // set account bonded (controller) or null
        let _bonded = bonded.unwrapOr(null);
        _bonded =
          _bonded === null ? null : (_bonded.toHuman() as string | null);
        newAccount.bonded = _bonded;

        // add bonded (controller) account as external account if not presently imported
        if (_bonded) {
          if (
            connectAccounts.find(
              (s: ImportedAccount) => s.address === _bonded
            ) === undefined
          ) {
            addExternalAccount(_bonded, 'system');
          }
        }

        // set account nominations.
        const newNominations = nominations.unwrapOr(null);
        newAccount.nominations =
          newNominations === null
            ? defaults.nominations
            : {
                targets: newNominations.targets.toHuman(),
                submittedIn: newNominations.submittedIn.toHuman(),
              };

        // remove stale account if it's already in list.
        const newAccounts = Object.values(accountsRef.current)
          .filter((a: BalancesAccount) => a.address !== address)
          .concat(newAccount);

        setStateWithRef(newAccounts, setAccounts, accountsRef);
      }
    );

    setStateWithRef(
      unsubsBalancesRef.current.concat({
        key: address,
        unsub,
      }),
      setUnsubsBalances,
      unsubsBalancesRef
    );
    return unsub;
  };

  const subscribeToLedger = async (address: string) => {
    if (!api) return;

    const unsub: () => void = await api.queryMulti<[AnyApi]>(
      [[api.query.staking.ledger, address]],
      async ([l]): Promise<void> => {
        let ledger: BalanceLedger;

        const _ledger = l.unwrapOr(null);
        // fallback to default ledger if not present
        if (_ledger !== null) {
          const { stash, total, active, unlocking } = _ledger;

          // format unlocking chunks
          const _unlocking = [];
          for (const u of unlocking.toHuman()) {
            const { era, value } = u;

            _unlocking.push({
              era: Number(rmCommas(era)),
              value: new BigNumber(rmCommas(value)),
            });
          }

          // add stash as external account if not present
          if (
            connectAccounts.find(
              (s: ImportedAccount) => s.address === stash.toHuman()
            ) === undefined
          ) {
            addExternalAccount(stash.toHuman(), 'system');
          }

          ledger = {
            address,
            stash: stash.toHuman(),
            active: new BigNumber(rmCommas(active.toString())),
            total: new BigNumber(rmCommas(total.toString())),
            unlocking: _unlocking,
          };

          // remove stale account if it's already in list, and concat.
          let _ledgers = Object.values(ledgersRef.current);
          _ledgers = _ledgers
            .filter((_l: BalanceLedger) => _l.stash !== ledger.stash)
            .concat(ledger);

          setStateWithRef(_ledgers, setLedgers, ledgersRef);
        } else {
          // no ledger: remove stale account if it's already in list.
          let _ledgers = Object.values(ledgersRef.current);
          _ledgers = _ledgers.filter(
            (_l: BalanceLedger) => _l.address !== address
          );
          setStateWithRef(_ledgers, setLedgers, ledgersRef);
        }
      }
    );

    const _unsubs = unsubsLedgersRef.current.concat({
      key: address,
      unsub,
    });
    setStateWithRef(_unsubs, setUnsubsLedgers, unsubsLedgersRef);
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
    if (balance?.free === undefined) {
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

  // get an account's locks metadata
  const getAccountLocks = (address: MaybeAccount) => {
    const account = accountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return [];
    }

    const locks = account.locks ?? [];
    return locks;
  };

  // get an account's bonded (controller) account)
  const getBondedAccount = (address: MaybeAccount) => {
    const account = accountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return null;
    }
    const bonded = account.bonded ?? null;
    return bonded;
  };

  // get an account's nominations
  const getAccountNominations = (address: MaybeAccount) => {
    const account = accountsRef.current.find(
      (a: BalancesAccount) => a.address === address
    );
    if (account === undefined) {
      return [];
    }
    const nominations = account.nominations;
    if (nominations === undefined) {
      return [];
    }

    const targets = nominations.targets ?? [];
    return targets;
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

  // check if an account is a controller account
  const isController = (address: MaybeAccount) => {
    const existsAsController = accountsRef.current.filter(
      (a: BalancesAccount) => (a?.bonded || '') === address
    );
    return existsAsController.length > 0;
  };

  return (
    <BalancesContext.Provider
      value={{
        getAccount,
        getAccountBalance,
        getLedgerForStash,
        getLedgerForController,
        getAccountLocks,
        getBondedAccount,
        getAccountNominations,
        isController,
        existentialAmount,
        accounts: accountsRef.current,
        ledgers: ledgersRef.current,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
