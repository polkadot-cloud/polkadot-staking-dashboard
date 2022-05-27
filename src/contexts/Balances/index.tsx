// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import * as defaults from './defaults';
import { toFixedIfNecessary, planckBnToUnit, rmCommas } from '../../Utils';
import { APIContextInterface } from '../../types/api';

export const BalancesContext: any = React.createContext({
  getAccount: () => true,
  getAccountBalance: () => true,
  getAccountLedger: () => true,
  getBondedAccount: () => true,
  getAccountNominations: () => true,
  getBondOptions: () => defaults.bondOptions,
  isController: () => true,
  accounts: [],
  reserveAmount: 0,
  existentialAmount: 0,
  minReserve: 0,
});

export const useBalances = () => React.useContext(BalancesContext);

export const BalancesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { api, isReady, network } = useApi() as APIContextInterface;
  const { accounts, activeExtension }: any = useConnect();
  const { units } = network;

  // balance accounts context state
  const [state, _setState]: any = useState({
    accounts: [],
  });
  const stateRef = useRef(state);
  const setState = (val: any) => {
    stateRef.current = val;
    _setState(val);
  };

  const [unsubs, _setUnsubs]: any = useState([]);
  const unsubsRef = useRef(unsubs);
  const setUnsubs = (val: any) => {
    unsubsRef.current = val;
    _setUnsubs(val);
  };

  // existential amount of unit for an account
  const [existentialAmount] = useState(new BN(10 ** units));

  // amount of compulsary reserve balance
  const [reserveAmount] = useState(existentialAmount.div(new BN(10)));

  // minimum reserve for submitting extrinsics
  const [minReserve] = useState(reserveAmount.add(existentialAmount));

  // unsubscribe and refetch active account
  useEffect(() => {
    if (isReady) {
      unsubscribeAll(true);
    }
    return () => {
      unsubscribeAll(false);
    };
  }, [accounts, network, isReady, activeExtension]);

  // unsubscribe from all activeAccount subscriptions
  const unsubscribeAll = async (refetch: boolean) => {
    // unsubscribe all unsubs
    Object.values(unsubsRef.current).map((v: any) => {
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

    const unsub = await api.queryMulti(
      [
        [api.query.system.account, address],
        [api.query.staking.bonded, address],
        [api.query.staking.nominators, address],
      ],
      async ([{ data: balance }, bonded, nominations]: any) => {
        const _account: any = {
          address,
        };

        // get account balances
        const { free, reserved, miscFrozen, feeFrozen } = balance;

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
        let _bonded = bonded.unwrapOr(null);
        _bonded = _bonded === null ? null : _bonded.toHuman();
        _account.bonded = _bonded;

        // get account ledger if controller present (separate API call)
        if (_bonded !== null) {
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
        let _accounts = Object.values(stateRef.current.accounts);
        // remove stale account if it's already in list
        _accounts = _accounts.filter((acc: any) => acc.address !== address);
        _accounts.push(_account);

        // update state
        setState({
          ...stateRef.current,
          accounts: _accounts,
        });
      }
    );

    const _unsubs = unsubsRef.current;
    _unsubs.push(unsub);
    setUnsubs(_unsubs);

    return unsub;
  };

  // get active account balances
  const getBalances = async () => {
    Promise.all(accounts.map((a: any) => subscribeToBalances(a.address)));
  };

  // get an account's balance metadata
  const getAccountBalance = (address: string) => {
    const account = stateRef.current.accounts.find(
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
    const account = stateRef.current.accounts.find(
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
    const account = stateRef.current.accounts.find(
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
    const _accounts = stateRef.current.accounts;
    const account = _accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return [];
    }
    const { nominations } = account;
    return nominations.targets;
  };

  // get an account
  const getAccount = (address: string) => {
    const account = stateRef.current.accounts.find(
      (acc: any) => acc.address === address
    );
    if (account === undefined) {
      return null;
    }
    return account;
  };

  // check if an account is a controller account
  const isController = (address: string) => {
    const existsAsController = stateRef.current.accounts.filter(
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
    for (const u of unlocking) {
      const { value } = u;
      totalUnlockingBn = totalUnlockingBn.add(value);
    }
    const totalUnlocking = planckBnToUnit(totalUnlockingBn, units);

    // free to bond balance
    let freeToBond: any = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) -
        planckBnToUnit(active, units) -
        totalUnlocking,
      units
    );
    freeToBond = freeToBond < 0 ? 0 : freeToBond;

    // total possible balance that can be bonded
    const totalPossibleBond = toFixedIfNecessary(
      planckBnToUnit(freeAfterReserve, units) - totalUnlocking,
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
        accounts: stateRef.current.accounts,
        minReserve,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
};
