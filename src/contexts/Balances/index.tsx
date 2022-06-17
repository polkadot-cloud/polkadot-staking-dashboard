// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { Fn, MaybeAccount, Unsubs } from 'types';
import { Option } from '@polkadot/types-codec';
import { useNetworkMetrics } from 'contexts/Network';
import { APIContextInterface } from 'types/api';
import { rmCommas, setStateWithRef } from 'Utils';

import {
  BalanceLedger,
  BalancesAccount,
  BalancesContextInterface,
  BondedAccount,
  BondOptions,
} from 'types/balances';
import { ConnectContextInterface } from 'types/connect';
import { WalletAccount } from '@talisman-connect/wallets';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import * as defaults from './defaults';

export const BalancesContext =
  React.createContext<BalancesContextInterface | null>(null);

export const useBalances = () => React.useContext(BalancesContext);

export const BalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network, consts } = useApi() as APIContextInterface;
  const { metrics } = useNetworkMetrics();
  const { accounts: connectAccounts } = useConnect() as ConnectContextInterface;
  const { activeEra } = metrics;

  // existential amount of unit for an account
  const existentialAmount = consts.existentialDeposit;

  // amount of compulsary reserve balance
  const reserveAmount: BN = existentialAmount.div(new BN(2));

  // minimum reserve for submitting extrinsics
  const minReserve: BN = reserveAmount.add(existentialAmount);

  // balance accounts state
  const [accounts, setAccounts] = useState<Array<BalancesAccount>>([]);
  const accountsRef = useRef(accounts);

  // subscriptions state
  const [unsubs, setUnsubs] = useState<Unsubs>([]);
  const unsubsRef = useRef<Unsubs>(unsubs);

  // bonded controller accounts derived from getBalances
  const [bondedAccounts, setBondedAccounts] = useState<Array<BondedAccount>>(
    []
  );
  const bondedAccountsRef = useRef(bondedAccounts);

  // account ledgers to separate storage
  const [ledgers, setLedgers] = useState<Array<BalanceLedger>>([]);
  const ledgersRef = useRef(ledgers);

  // store how many ledgers are currently syncing
  const [ledgersSyncingCount, setLedgersSyncingCount] = useState(0);
  const ledgersSyncingCountRef = useRef(ledgersSyncingCount);

  // fetch account balances
  useEffect(() => {
    if (isReady) {
      // unsubscribe from current accounts and ledgers
      (async () => {
        setStateWithRef([], setBondedAccounts, bondedAccountsRef);
        setStateWithRef([], setLedgers, ledgersRef);
        setStateWithRef(0, setLedgersSyncingCount, ledgersSyncingCountRef);
        await unsubscribeAll();
        getBalances();
      })();
    }
  }, [connectAccounts, network, isReady]);

  // fetch bonded account ledgers
  useEffect(() => {
    getLedgers();
  }, [bondedAccountsRef.current]);

  // unsubscribe from everything on unmount
  useEffect(() => {
    return () => {
      unsubscribeAll();
    };
  }, []);

  const unsubscribeAll = async () => {
    Object.values(unsubsRef.current).forEach(async (v: Fn) => {
      await v();
    });
    Object.values(bondedAccountsRef.current).forEach(
      async (b: BondedAccount) => {
        if (b.unsub !== null) {
          await b.unsub();
        }
      }
    );
  };

  const getBalances = async () => {
    // subscribe to account balances
    Promise.all(
      connectAccounts.map((a: WalletAccount) => subscribeToBalances(a.address))
    );
  };

  // subscribe to account ledgers
  const getLedgers = async () => {
    const subs = bondedAccountsRef.current.filter(
      (b: BondedAccount) => b.unsub === null
    );
    Promise.all(subs.map((a: BondedAccount) => subscribeToLedger(a.address)));
  };

  // subscribe to account balances, ledger, bonded and nominators
  const subscribeToBalances = async (address: string) => {
    if (!api) return;

    const unsub: () => void = await api.queryMulti<
      [any, any, Option<any>, Option<any>]
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
        let freeAfterReserve = new BN(free).sub(minReserve);
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

        // add bonded account to `bondedAccounts` if present
        if (_bonded !== null) {
          const _bondedAccounts = [...bondedAccountsRef.current].concat({
            address: _bonded,
            unsub: null,
          });

          setStateWithRef(
            _bondedAccounts,
            setBondedAccounts,
            bondedAccountsRef
          );
        }

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

    const _unsubs = unsubsRef.current.concat(unsub);
    setStateWithRef(_unsubs, setUnsubs, unsubsRef);
    return unsub;
  };

  const subscribeToLedger = async (address: string) => {
    if (!api) return;

    // increment syncing ledger counter
    setStateWithRef(
      Math.max(ledgersSyncingCountRef.current + 1, 0),
      setLedgersSyncingCount,
      ledgersSyncingCountRef
    );

    const unsub = await api.query.staking.ledger(address, (l: any) => {
      let ledger: BalanceLedger;

      const _ledger = l.unwrapOr(null);
      // fallback to default ledger if not present
      if (_ledger === null) {
        ledger = defaults.ledger;
      } else {
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
        ledger = {
          stash: stash.toHuman(),
          active: active.toBn(),
          total: total.toBn(),
          unlocking: _unlocking,
        };
      }

      // update ledgers in context state
      let _ledgers = Object.values(ledgersRef.current);
      // remove stale account if it's already in list
      _ledgers = _ledgers
        .filter((_l: BalanceLedger) => _l.stash !== ledger.stash)
        .concat(ledger);

      // decrement syncing ledger counter
      setStateWithRef(
        Math.max(ledgersSyncingCountRef.current - 1, 0),
        setLedgersSyncingCount,
        ledgersSyncingCountRef
      );

      // update state
      setStateWithRef(_ledgers, setLedgers, ledgersRef);
    });

    // add unsub to `bondedAccounts`
    let _bondedAccounts = bondedAccountsRef.current;
    _bondedAccounts = _bondedAccounts.map((a: any) => {
      if (a.address === address) {
        return {
          address,
          unsub,
        };
      }
      return a;
    });
    setStateWithRef(_bondedAccounts, setBondedAccounts, bondedAccountsRef);
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

  // get an account's ledger metadata
  const getAccountLedger = (address: MaybeAccount) => {
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

  // get the bond and unbond amounts available to the user
  const getBondOptions = (address: MaybeAccount): BondOptions => {
    const account = getAccount(address);
    if (account === null) {
      return defaults.bondOptions;
    }
    const balance = getAccountBalance(address);
    const ledger = getAccountLedger(address);
    const { freeAfterReserve } = balance;
    const { active, unlocking } = ledger;
    // free to unbond balance
    const freeToUnbond = active;

    // total amount actively unlocking
    let totalUnlocking = new BN(0);
    let totalUnlocked = new BN(0);

    for (const u of unlocking) {
      const { value, era } = u;

      if (activeEra.index > era) {
        totalUnlocked = totalUnlocked.add(value);
      } else {
        totalUnlocking = totalUnlocking.add(value);
      }
    }

    // free to bond balance
    const freeToBond = BN.max(
      freeAfterReserve.sub(active).sub(totalUnlocking).sub(totalUnlocked),
      new BN(0)
    );

    // total possible balance that can be bonded
    const totalPossibleBond = BN.max(
      freeAfterReserve.sub(totalUnlocking).sub(totalUnlocked),
      new BN(0)
    );

    const freeToStake = BN.max(
      freeAfterReserve.sub(active).sub(totalUnlocking).sub(totalUnlocked),
      new BN(0)
    );

    return {
      freeToBond,
      freeToUnbond,
      totalUnlocking,
      totalUnlocked,
      totalPossibleBond,
      freeToStake,
      totalUnlockChuncks: unlocking.length,
    };
  };

  return (
    <BalancesContext.Provider
      value={{
        getAccount,
        getAccountBalance,
        getAccountLedger,
        getAccountLocks,
        getBondedAccount,
        getAccountNominations,
        getBondOptions,
        isController,
        accounts: accountsRef.current,
        minReserve,
        ledgersSyncingCount: ledgersSyncingCountRef.current,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
