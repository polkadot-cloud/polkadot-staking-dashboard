// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useApi } from './Api';
import { useConnect } from './Connect';
import { SUBSCAN_ENABLED, API_ENDPOINTS, API_SUBSCAN_KEY } from '../constants';

export interface SubscanContextState {
  payouts: any;
}

export const SubscanContext: React.Context<SubscanContextState> = React.createContext({
  payouts: [],
});

export const useSubscan = () => React.useContext(SubscanContext);

export const SubscanContextWrapper = (props: any) => {

  const { network }: any = useApi();
  const { activeAccount }: any = useConnect();

  const [state, setState]: any = useState({
    payouts: [],
  });

  useEffect(() => {
    fetchPayouts();
  }, [activeAccount]);


  const fetchPayouts = () => {

    if (!SUBSCAN_ENABLED) {
      return;
    }

    // reset payouts immediately
    setState({
      payouts: []
    });

    fetch(network.subscanEndpoint + API_ENDPOINTS['subscanRewardSlash'], {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_SUBSCAN_KEY,
      },
      body: JSON.stringify({
        row: 21,
        page: 0,
        address: activeAccount,
      }),
      method: "POST"
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === 'Success') {
          if (res.data.list !== null) {
            setState({
              payouts: res.data.list.reverse(),
            });
          } else {
            setState({
              payouts: [],
            });
          }
        }
      });
  }

  return (
    <SubscanContext.Provider value={{
      payouts: state.payouts,
    }}>
      {props.children}
    </SubscanContext.Provider>
  );
}