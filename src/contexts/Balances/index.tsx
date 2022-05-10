// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import * as defaults from './defaults';

export const BalancesContext: any = React.createContext({
  getAccount: (a: string) => { },
  getAccountBalance: (a: string) => { },
  getAccountLedger: (a: string) => { },
  getBondedAccount: (a: string) => { },
  getAccountNominations: (a: string) => { },
  accounts: [],
  reserveAmount: 0,
  existentialAmount: 0,
  minReserve: 0,
});
export const useBalances = () => React.useContext(BalancesContext);

export const BalancesProvider = (props: any) => {

  const { api, isReady, network }: any = useApi();
  const { accounts, activeWallet }: any = useConnect();
  const { units } = network;

  // balance accounts context state
  const [state, _setState]: any = useState({
    accounts: [],
    unsub: [],
  });

  const stateRef = useRef(state);
  const setState = (val: any) => {
    stateRef.current = val;
    _setState(val);
  }

  // existential amount of unit for an account
  const [existentialAmount] = useState(
    new BN(10 ** units)
  );

  // amount of compulsary reserve balance
  const [reserveAmount] = useState(
    existentialAmount.div(new BN(10))
  );

  // minimum reserve for submitting extrinsics
  const [minReserve] = useState(
    reserveAmount.add(existentialAmount)
  );

  // unsubscribe and refetch active account
  useEffect(() => {
    if (isReady) { unsubscribeAll(true); }
    return (() => {
      unsubscribeAll(false);
    });
  }, [accounts, network, isReady, activeWallet]);

  // unsubscribe from all activeAccount subscriptions
  const unsubscribeAll = async (refetch: boolean) => {
    // unsubscribe from accounts
    let { unsub } = stateRef.current;
    for (let unsubscribe of unsub) {
      await unsubscribe();
    }
    // refetch balances
    if (refetch) {
      getBalances();
    }
  }

  // subscribe to account balances, ledger, bonded and nominators
  const subscribeToBalances = async (address: string) => {

    const unsub = await api.queryMulti([
      [api.query.system.account, address],
      [api.query.staking.ledger, address],
      [api.query.staking.bonded, address],
      [api.query.staking.nominators, address],
    ], ([{ data: balance }, ledger, bonded, nominations]: any) => {

      // account state update
      let _account: any = {
        address: address,
      };

      // get account balances
      let { free, reserved, miscFrozen, feeFrozen } = balance;

      // calculate free balance after app reserve
      let freeAfterReserve = new BN(free).sub(minReserve);
      freeAfterReserve = freeAfterReserve.lt(new BN(0))
        ? new BN(0)
        : freeAfterReserve;

      // set account balances to context
      _account['balance'] = {
        free: free.toBn(),
        reserved: reserved.toBn(),
        miscFrozen: miscFrozen.toBn(),
        feeFrozen: feeFrozen.toBn(),
        freeAfterReserve: freeAfterReserve,
      };

      // set account ledger
      let _ledger = ledger.unwrapOr(null);
      if (_ledger === null) {
        _account['ledger'] = defaults.ledger;
      } else {

        const { stash, total, active, unlocking } = _ledger;

        _account['ledger'] = {
          stash: stash.toHuman(),
          active: active.toBn(),
          total: total.toBn(),
          unlocking: unlocking.toHuman(),
        };
      }

      // set account bonded (controller) or null
      let _bonded = bonded.unwrapOr(null);
      _bonded = _bonded === null
        ? null
        : _bonded.toHuman();
      _account['bonded'] = _bonded;

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

      _account['nominations'] = _nominations;

      // update account in context state
      let _accounts = Object.values(stateRef.current.accounts);
      _accounts = _accounts.filter((acc: any) => acc.address !== address);
      _accounts.push(_account);

      // update state
      setState({
        ...stateRef.current,
        accounts: _accounts
      });
    });

    return unsub;
  }

  // get active account balances
  const getBalances = async () => {
    const unsubs = await Promise.all(
      accounts.map((a: any) => subscribeToBalances(a.address))
    );
    setState({
      ...stateRef.current,
      unsub: unsubs
    });
  }

  // get an account's balance metadata
  const getAccountBalance = (address: string) => {
    const account = stateRef.current.accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return defaults.balance;
    }
    const { balance } = account;
    if (balance.free === undefined) {
      return defaults.balance;
    }
    return balance;
  }

  //get an account's ledger metadata
  const getAccountLedger = (address: string) => {
    const account = stateRef.current.accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return defaults.ledger;
    }
    const { ledger } = account;
    if (ledger.stash === undefined) {
      return defaults.ledger;
    }
    return ledger;
  }

  //get an account's bonded (controller) account)
  const getBondedAccount = (address: string) => {
    const account = stateRef.current.accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return [];
    }
    const { bonded } = account;
    return bonded;
  }

  // get an account's nominations
  const getAccountNominations = (address: string) => {
    let _accounts = stateRef.current.accounts;
    const account = _accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return [];
    }
    const { nominations } = account;
    return nominations.targets;
  }

  // get an account
  const getAccount = (address: string) => {
    const account = stateRef.current.accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return null;
    }
    return account;
  }

  return (
    <BalancesContext.Provider value={{
      getAccount: getAccount,
      getAccountBalance: getAccountBalance,
      getAccountLedger: getAccountLedger,
      getBondedAccount: getBondedAccount,
      getAccountNominations: getAccountNominations,
      accounts: stateRef.current.accounts,
      minReserve: minReserve,
    }}>
      {props.children}
    </BalancesContext.Provider>
  )
}