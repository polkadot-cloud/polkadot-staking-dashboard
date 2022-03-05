// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useApi } from './Api';
import { useConnect } from './Connect';

export const BalancesContext: any = React.createContext({
  balances: {}
});
export const useBalances = () => React.useContext(BalancesContext);

export const BalancesContextWrapper = (props: any) => {

  const { api, isReady }: any = useApi();
  const { activeAccount }: any = useConnect();

  const [state, setState]: any = useState({
    balances: {
      free: 0,
      reserved: 0,
      miscFrozen: 0,
      feeFrozen: 0,
    },
    ledger: {
      stash: null,
      active: 0,
      total: 0,
      unlocking: [],
    },
    unsub: undefined,
  });

  // unsub and resubscribe to newly active account
  useEffect(() => {

    if (isReady()) {
      // unsubscribe and refetch active account
      unsubscribeAll(true);
    }
    return (() => {
      unsubscribeAll(false);
    });
  }, [activeAccount, isReady()]);

  // unsubscribe from all activeAccount subscriptions
  const unsubscribeAll = async (refetch: boolean) => {
    if (state.unsub !== undefined) {
      state.unsub();
    }
    if (refetch) {
      getBalances();
    }
  }

  // get active account balances. Should be called when an account switches
  const getBalances = async () => {

    if (activeAccount.address === undefined) {
      return;
    }

    // Subscribe to the timestamp, our index and balance
    const unsub = await api.queryMulti([
      [api.query.system.account, activeAccount.address],
      [api.query.staking.ledger, activeAccount.address],
    ], ([{ nonce, data: balance }, ledger]: any) => {

      let _state = {};

      let { free, reserved, miscFrozen, feeFrozen } = balance;
      _state = {
        ..._state,
        balances: {
          free: parseInt(free.toString()),
          reserved: parseInt(reserved.toString()),
          miscFrozen: parseInt(miscFrozen.toString()),
          feeFrozen: parseInt(feeFrozen.toString()),
        },
      };

      ledger = ledger.unwrapOrDefault(null);
      if (ledger !== null) {
        const { stash, total, active, unlocking } = ledger;
        _state = {
          ..._state,
          ledger: {
            stash: stash.toHuman(),
            active: active.toNumber(),
            total: total.toNumber(),
            unlocking: unlocking.toHuman(),
          }
        }
      };

      setState(_state);
    });


    // store unsubscribe handler in state
    setState({
      ...state,
      unsub: unsub,
    });
  }

  return (
    <BalancesContext.Provider value={{
      balances: state.balances,
      ledger: state.ledger,
    }}>
      {props.children}
    </BalancesContext.Provider>
  )
}

export default BalancesContextWrapper;