// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { AnyApi, MaybeAccount } from 'types';
import { Option } from '@polkadot/types-codec';
import { rmCommas, setStateWithRef } from 'Utils';
import {
  BalanceLedger,
  BalancesAccount,
  BalancesContextInterface,
} from 'contexts/Balances/types';
import { ImportedAccount } from 'contexts/Connect/types';
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
        // subscribe to account balances
        Promise.all(
          accountsAdded.map((a: ImportedAccount) =>
            subscribeToBalances(a.address)
          )
        );
        Promise.all(
          accountsAdded.map((a: ImportedAccount) =>
            subscribeToLedger(a.address)
          )
        );
      }
    }
  }, [connectAccounts, network, isReady]);

  // unsubscribe from everything on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, []);

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

    const unsub: () => void = await api.queryMulti<
      [AnyApi, AnyApi, Option<AnyApi>, Option<AnyApi>]
    >(
      [
        [api.query.system.account, address],
        [api.query.balances.locks, address],
        [api.query.staking.bonded, address],
        [api.query.staking.nominators, address],
      ],
      async ([{ data }, locks, bonded, nominations]): Promise<void> => {
        const _account: BalancesAccount = {
          address,
        };

        // get account balances
        const { free, reserved, miscFrozen, feeFrozen } = data;

        // calculate free balance after app reserve
        let freeAfterReserve = new BN(free).sub(existentialAmount);
        freeAfterReserve = freeAfterReserve.lt(new BN(0))
          ? new BN(0)
          : freeAfterReserve;

        // set account balances to context
        _account.balance = {
          free: free.toBn(),
          reserved: reserved.toBn(),
          miscFrozen: miscFrozen.toBn(),
          feeFrozen: feeFrozen.toBn(),
          freeAfterReserve,
        };

        // get account locks
        const _locks = locks.toHuman();
        for (let i = 0; i < _locks.length; i++) {
          _locks[i].amount = new BN(rmCommas(_locks[i].amount));
        }
        _account.locks = _locks;

        // set account bonded (controller) or null
        let _bonded = bonded.unwrapOr(null);
        _bonded =
          _bonded === null ? null : (_bonded.toHuman() as string | null);
        _account.bonded = _bonded;

        // set account nominations
        let _nominations = nominations.unwrapOr(null);
        if (_nominations === null) {
          _nominations = defaults.nominations;
        } else {
          _nominations = {
            targets: _nominations.targets.toHuman(),
            submittedIn: _nominations.submittedIn.toHuman(),
          };
        }

        _account.nominations = _nominations;

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
            const era = rmCommas(u.era);
            const value = rmCommas(u.value);
            _unlocking.push({
              era: Number(era),
              value: new BN(value),
            });
          }

          // add stash as external account if not present
          if (
            !connectAccounts.find(
              (s: ImportedAccount) => s.address === stash.toHuman()
            )
          ) {
            addExternalAccount(stash.toHuman(), 'system');
          }

          ledger = {
            address,
            stash: stash.toHuman(),
            active: active.toBn(),
            total: total.toBn(),
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
