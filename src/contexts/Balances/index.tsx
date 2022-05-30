// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { Fn, Unsubs } from 'types';
import { Option } from '@polkadot/types-codec';
import { useNetworkMetrics } from 'contexts/Network';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import * as defaults from './defaults';
import { toFixedIfNecessary, planckBnToUnit, rmCommas } from '../../Utils';
import { APIContextInterface } from '../../types/api';

import {
  BalancesAccount,
  BalancesContextInterface,
} from '../../types/balances';

export const BalancesContext =
  React.createContext<BalancesContextInterface | null>(null);

export const useBalances = () => React.useContext(BalancesContext);

export const BalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network } = useApi() as APIContextInterface;
  const { metrics } = useNetworkMetrics();
  const { accounts: connectAccounts, activeExtension }: any = useConnect();
  const { activeEra } = metrics;
  const { units } = network;

  // balance accounts context state
  const [accounts, _setAccounts] = useState<Array<BalancesAccount>>([]);

  const accountsRef = useRef(accounts);
  const setAccounts = (val: Array<BalancesAccount>) => {
    accountsRef.current = val;
    _setAccounts(val);
  };

  const [unsubs, _setUnsubs] = useState<Unsubs>([]);
  const unsubsRef = useRef<Unsubs>(unsubs);
  const setUnsubs = (val: Unsubs) => {
    unsubsRef.current = val;
    _setUnsubs(val);
  };

  // existential amount of unit for an account
  const [existentialAmount] = useState<BN>(new BN(10 ** units));

  // amount of compulsary reserve balance
  const [reserveAmount] = useState<BN>(existentialAmount.div(new BN(10)));

  // minimum reserve for submitting extrinsics
  const [minReserve] = useState<BN>(reserveAmount.add(existentialAmount));

  // unsubscribe and refetch active account
  useEffect(() => {
    if (isReady) {
      unsubscribeAll(true);
    }
    return () => {
      unsubscribeAll(false);
    };
  }, [connectAccounts, network, isReady, activeExtension]);

  // unsubscribe from all activeAccount subscriptions
  const unsubscribeAll = async (refetch: boolean) => {
    // unsubscribe all unsubs
    Object.values(unsubsRef.current).map((v: Fn) => {
      return v();
    });
    // refetch balances
    if (refetch) {
      getBalances();
    }
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

        // get account ledger if controller present (separate API call)
        if (_bonded === null) {
          _account.ledger = defaults.ledger;
        } else {
          const ledger: any = await api.query.staking.ledger(_bonded);
          const _ledger = ledger.unwrapOr(null);

          // fallback to default ledger if not present
          if (_ledger === null) {
            _account.ledger = defaults.ledger;
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
            _account.ledger = {
              stash: stash.toHuman(),
              active: active.toBn(),
              total: total.toBn(),
              unlocking: _unlocking,
            };
          }
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
        _accounts = _accounts.filter((acc: any) => acc.address !== address);
        _accounts.push(_account);

        // update state
        setAccounts(_accounts);
      }
    );

    const _unsubs = unsubsRef.current;
    _unsubs.push(unsub);
    setUnsubs(_unsubs);

    return unsub;
  };

  // get active account balances
  const getBalances = async () => {
    Promise.all(
      connectAccounts.map((a: any) => subscribeToBalances(a.address))
    );
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
    const account = accountsRef.current.find(
      (acc: any) => acc.address === address
    );
    if (account === undefined) {
      return defaults.ledger;
    }
    const { ledger } = account;
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
    let freeToBond: any = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) -
        planckBnToUnit(active, units) -
        totalUnlocking -
        totalUnlocked,
      units
    );
    freeToBond = freeToBond < 0 ? 0 : freeToBond;

    // total possible balance that can be bonded
    const totalPossibleBond = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) - totalUnlocking - totalUnlocked,
      units
    );

    let freeToStake = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) - planckBnToUnit(active, units),
      units
    );
    freeToStake = freeToStake < 0 ? 0 : freeToStake;

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
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
