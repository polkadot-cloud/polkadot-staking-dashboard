// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useRef } from 'react';
import { useApi } from './Api';
import { useConnect } from './Connect';

export const BalancesContext: any = React.createContext({
  getAccount: (a: string) => { },
  getAccountBalance: (a: string) => { },
  getAccountLedger: (a: string) => { },
  getBondedAccount: (a: string) => { },
  getAccountNominations: (a: string) => { },
  accounts: [],
  reserveAmount: 0.1,
  existentialAmount: 1,
  minReserve: 1.1,
});
export const useBalances = () => React.useContext(BalancesContext);

export const BalancesProvider = (props: any) => {

  const { api, isReady, network }: any = useApi();
  const { accounts }: any = useConnect();

  const [state, _setState]: any = useState({
    accounts: [],
    unsub: [],
  });

  // the amount of whole unit to reserve when submitting extrinsics
  const [reserveAmount] = useState(0.1);

  // the existential amount of unit for an account
  const [existentialAmount] = useState(1);

  // the minimum reserve for submitting extrinsics on staking dashboard
  const [minReserve] = useState(reserveAmount + existentialAmount);

  const stateRef = useRef(state);

  const setState = (val: any) => {
    stateRef.current = val;
    _setState(val);
  }

  const defaultBalance = () => {
    return {
      free: 0,
      reserved: 0,
      miscFrozen: 0,
      feeFrozen: 0,
    };
  }

  const defaultLedger = () => {
    return {
      stash: null,
      active: 0,
      total: 0,
      unlocking: [],
    };
  }

  const defaultNominations = () => {
    return {
      targets: [],
      submittedIn: 0,
    };
  }

  // unsub and resubscribe to newly active account
  useEffect(() => {
    if (isReady) {
      // unsubscribe and refetch active account
      unsubscribeAll(true);
    }
    return (() => {
      unsubscribeAll(false);
    });
  }, [accounts, network, isReady]);


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


  // make a balance subscription
  const subscribeToBalances = async (address: string) => {

    // Subscribe to account balances and ledger
    const unsub = await api.queryMulti([
      [api.query.system.account, address],
      [api.query.staking.ledger, address],
      [api.query.staking.bonded, address],
      [api.query.staking.nominators, address],
    ], ([{ nonce, data: balance }, ledger, bonded, nominations]: any) => {

      // account state update
      let _account: any = {
        address: address,
      };

      // set account balance
      let { free, reserved, miscFrozen, feeFrozen } = balance;
      _account['balance'] = {
        free: parseInt(free.toString()),
        reserved: parseInt(reserved.toString()),
        miscFrozen: parseInt(miscFrozen.toString()),
        feeFrozen: parseInt(feeFrozen.toString()),
      };

      // set account ledger
      let _ledger = ledger.unwrapOr(null);
      if (_ledger === null) {
        _account['ledger'] = defaultLedger();
      } else {

        const { stash, total, active, unlocking } = _ledger;
        _account['ledger'] = {
          stash: stash.toHuman(),
          active: active.toNumber(),
          total: total.toNumber(),
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
        _nominations = defaultNominations();
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
      setState({ ...stateRef.current, accounts: _accounts });
    });

    return unsub;
  }

  // get active account balances. Should be called when an account switches
  const getBalances = async () => {
    Promise.all(
      accounts.map((a: any) => subscribeToBalances(a.address))).then((unsubs: any) => {
        setState({
          ...stateRef.current,
          unsub: unsubs
        });
      });
  }

  // get an account's balance metadata
  const getAccountBalance = (address: string) => {
    const account = stateRef.current.accounts.filter((acc: any) => acc.address === address);

    if (!account.length) {
      return defaultBalance();
    }
    const { balance } = account[0];

    if (balance.free === undefined) {
      return defaultBalance();
    }
    return balance;
  }

  //get an account's ledger metadata
  const getAccountLedger = (address: string) => {
    const account = stateRef.current.accounts.find((acc: any) => acc.address === address);
    if (account === undefined) {
      return defaultLedger();
    }
    const { ledger } = account;

    if (ledger.stash === undefined) {
      return defaultLedger();
    }
    return ledger;
  }

  //get an account's bonded (controller) account)
  const getBondedAccount = (address: string) => {
    const account = stateRef.current.accounts.filter((acc: any) => acc.address === address);
    if (!account.length) {
      return null;
    }
    const { bonded } = account[0];
    return bonded;
  }

  // get an account's nominations
  const getAccountNominations = (address: string) => {
    const account = stateRef.current.accounts.filter((acc: any) => acc.address === address);
    if (!account.length) {
      return [];
    }
    const { nominations } = account[0];
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
      reserveAmount: reserveAmount,
      existentialAmount: existentialAmount,
      minReserve: minReserve,
    }}>
      {props.children}
    </BalancesContext.Provider>
  )
}