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

  const [state, setState] = useState({
    balances: {
      free: 0,
      reserved: 0,
      miscFrozen: 0,
      feeFrozen: 0,
    },
    unsubscribe: () => { },
  });

  // unsub and resubscribe to newly active account
  useEffect(() => {
    if (isReady()) {
      state.unsubscribe();
      getBalances();
    }
    return (() => {
      state.unsubscribe();
    });
  }, [activeAccount, isReady()]);

  // get active account balances. Should be called when an account switches
  const getBalances = async () => {

    // subscribe to account balances
    const unsub1 = await api.query.system.account(activeAccount.address, ({ nonce, data: balance }: any) => {
      let { free, reserved, miscFrozen, feeFrozen } = balance;
      // update balance state
      setState({
        ...state,
        balances: {
          free: parseInt(free.toString()),
          reserved: parseInt(reserved.toString()),
          miscFrozen: parseInt(miscFrozen.toString()),
          feeFrozen: parseInt(feeFrozen.toString()),
        }
      });
    });

    // store unsubscribe handler in state
    setState({ ...state, unsubscribe: unsub1 });
  }

  return (
    <BalancesContext.Provider value={{
      balances: state.balances
    }}>
      {props.children}
    </BalancesContext.Provider>
  )
}

export default BalancesContextWrapper;