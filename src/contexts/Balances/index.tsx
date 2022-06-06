// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { Fn, Unsubs } from 'types';
import { Option } from '@polkadot/types-codec';
import { useNetworkMetrics } from 'contexts/Network';
import { APIContextInterface } from 'types/api';
import {
  toFixedIfNecessary,
  planckBnToUnit,
  rmCommas,
  setStateWithRef,
} from 'Utils';
import { BalancesAccount, BalancesContextInterface } from 'types/balances';
import { ConnectContextInterface } from 'types/connect';
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
  const { units } = network;

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
  const [bondedAccounts, setBondedAccounts] = useState<Array<any>>([]);
  const bondedAccountsRef = useRef<Array<any>>(bondedAccounts);

  // account ledgers to separate storage
  const [ledgers, setLedgers] = useState<any>([]);
  const ledgersRef = useRef<Array<any>>(ledgers);

  // store how many ledgers are currently syncing
  const [ledgersSyncingCount, setLedgersSyncingCount] = useState(0);
  const ledgersSyncingCountRef = useRef(ledgersSyncingCount);

  // fetch account balances
  useEffect(() => {
    if (isReady) {
      // unsubscribe from current accounts and ledgers
      setStateWithRef([], setBondedAccounts, bondedAccountsRef);
      setStateWithRef([], setLedgers, ledgersRef);
      setStateWithRef(0, setLedgersSyncingCount, ledgersSyncingCountRef);
      unsubscribeAll();
      getBalances();
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
    Object.values(bondedAccountsRef.current).forEach(async (v: any) => {
      if (v.unsub !== null) {
        await v.unsub();
      }
    });
  };

  const getBalances = async () => {
    // subscribe to account balances
    Promise.all(
      connectAccounts.map((a: any) => subscribeToBalances(a.address))
    );
  };

  // subscribe to account ledgers
  const getLedgers = async () => {
    const subs = bondedAccountsRef.current.filter(
      (account: any) => account.unsub === null
    );
    Promise.all(subs.map((a: any) => subscribeToLedger(a.address)));
  };

  // subscribe to account balances, ledger, bonded and nominators
  const subscribeToBalances = async (address: string) => {
    if (!api) return;

    const unsub: () => void = await api.queryMulti<
      [any, Option<any>, Option<any>]
    >(
      [
        [api.query.system.account, address],
        [api.query.staking.bonded, address],
        [api.query.staking.nominators, address],
      ],
      async ([{ data }, bonded, nominations]): Promise<void> => {
        const _account: any = {
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

        // set account bonded (controller) or null
        let _bonded: any = bonded.unwrapOr(null);
        _bonded = _bonded === null ? null : _bonded.toHuman();
        _account.bonded = _bonded;

        // add bonded account to `bondedAccounts` if present
        if (_bonded !== null) {
          const _bondedAccounts: Array<any> = [
            ...bondedAccountsRef.current,
          ].concat({
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
        let _nominations: any = nominations.unwrapOr(null);
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
          .filter((acc: any) => acc.address !== address)
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
      let ledger: any;

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
        .filter((acc: any) => acc.stash !== ledger.stash)
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
    _bondedAccounts = _bondedAccounts.map((acc: any) => {
      if (acc.address === address) {
        return {
          address,
          unsub,
        };
      }
      return acc;
    });
    setStateWithRef(_bondedAccounts, setBondedAccounts, bondedAccountsRef);
    return unsub;
  };

  // get an account's balance metadata
  const getAccountBalance = (address: string) => {
    const account = accountsRef.current.find(
      (acc: any) => acc.address === address
    );
    if (account === undefined) {
      return defaults.balance;
    }
    const { balance } = account;
    if (balance.free === undefined) {
      return defaults.balance;
    }
    return balance;
  };

  // get an account's ledger metadata
  const getAccountLedger = (address: string) => {
    const ledger = ledgersRef.current.find((acc: any) => acc.stash === address);
    if (ledger === undefined) {
      return defaults.ledger;
    }
    if (ledger.stash === undefined) {
      return defaults.ledger;
    }
    return ledger;
  };

  // get an account's bonded (controller) account)
  const getBondedAccount = (address: string) => {
    const account = accountsRef.current.find(
      (acc: any) => acc.address === address
    );
    if (account === undefined) {
      return [];
    }
    const { bonded } = account;
    return bonded;
  };

  // get an account's nominations
  const getAccountNominations = (address: string) => {
    const _accounts = accountsRef.current;
    const account = _accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return [];
    }
    const { nominations } = account;
    return nominations.targets;
  };

  // get an account
  const getAccount = (address: string) => {
    const account = accountsRef.current.find(
      (acc: any) => acc.address === address
    );
    if (account === undefined) {
      return null;
    }
    return account;
  };

  // check if an account is a controller account
  const isController = (address: string) => {
    const existsAsController = accountsRef.current.filter(
      (account: any) => account?.bonded === address
    );
    return existsAsController.length > 0;
  };

  // get the bond and unbond amounts available to the user
  const getBondOptions = (address: string) => {
    const account = getAccount(address);
    if (account === null) {
      return defaults.bondOptions;
    }
    const balance = getAccountBalance(address);
    const ledger = getAccountLedger(address);
    const { freeAfterReserve } = balance;
    const { active, unlocking } = ledger;

    // free to unbond balance
    const freeToUnbond = toFixedIfNecessary(
      planckBnToUnit(active, units),
      units
    );

    // total amount actively unlocking
    let totalUnlockingBn = new BN(0);
    let totalUnlockedBn = new BN(0);

    for (const u of unlocking) {
      const { value, era } = u;

      if (activeEra.index > era) {
        totalUnlockedBn = totalUnlockedBn.add(value);
      } else {
        totalUnlockingBn = totalUnlockingBn.add(value);
      }
    }
    const totalUnlocking = planckBnToUnit(totalUnlockingBn, units);
    const totalUnlocked = planckBnToUnit(totalUnlockedBn, units);

    // free to bond balance
    const freeToBond: any = Math.max(
      toFixedIfNecessary(
        planckBnToUnit(freeAfterReserve, units) -
          planckBnToUnit(active, units) -
          totalUnlocking -
          totalUnlocked,
        units
      ),
      0
    );

    // total possible balance that can be bonded
    const totalPossibleBond = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) - totalUnlocking - totalUnlocked,
      units
    );

    const freeToStake = Math.max(
      toFixedIfNecessary(
        planckBnToUnit(freeAfterReserve, units) -
          planckBnToUnit(active, units) -
          totalUnlocking -
          totalUnlocked,
        units
      ),
      0
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
