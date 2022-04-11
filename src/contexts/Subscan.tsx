// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { useApi } from './Api';
import { useConnect } from './Connect';
import { useUi } from './UI';
import { API_ENDPOINTS, API_SUBSCAN_KEY } from '../constants';

export interface SubscanContextState {
  fetchEraPoints: (v: string, e: number) => void;
  payouts: any;
}

export const SubscanContext: React.Context<SubscanContextState> = React.createContext({
  fetchEraPoints: (v: string, e: number) => { },
  payouts: [],
});

export const useSubscan = () => React.useContext(SubscanContext);

export const SubscanContextWrapper = (props: any) => {

  const { network }: any = useApi();
  const { services }: any = useUi();
  const { activeAccount }: any = useConnect();

  const [payouts, setPayouts]: any = useState([]);

  // fetch payouts as soon as network is ready
  useEffect(() => {
    fetchPayouts();
  }, [activeAccount, network]);

  const fetchPayouts = () => {
    if (activeAccount === '' || !services.includes('subscan')) {
      setPayouts([]);
      return;
    }

    // reset payouts immediately
    setPayouts([]);

    fetch(network.subscanEndpoint + API_ENDPOINTS['subscanRewardSlash'], {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_SUBSCAN_KEY,
      },
      body: JSON.stringify({
        row: 60,
        page: 0,
        address: activeAccount,
      }),
      method: "POST"
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === 'Success') {
          if (res.data.list !== null) {
            setPayouts(res.data.list.reverse());
          } else {
            setPayouts([]);
          }
        }
      });
  }

  const fetchEraPoints = async (address: string, era: number) => {
    if (address === '' || !services.includes('subscan')) {
      return [];
    }
    let res: any = await fetch(network.subscanEndpoint + API_ENDPOINTS['subscanEraStat'], {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_SUBSCAN_KEY,
      },
      body: JSON.stringify({
        row: 60,
        page: 0,
        address: address,
      }),
      method: "POST"
    });

    res = await res.json();
    if (res.message === 'Success') {
      if (res.data?.list !== null) {
        let list = [];
        for (let i = era; i > (era - 60); i--) {
          list.push({
            era: i,
            reward_point: res.data.list.find((item: any) => item.era === i)?.reward_point ?? 0
          });
        }

        return list;
      } else {
        return [];
      }
    }
    return [];
  }

  return (
    <SubscanContext.Provider value={{
      fetchEraPoints: fetchEraPoints,
      payouts: payouts,
    }}>
      {props.children}
    </SubscanContext.Provider>
  );
}