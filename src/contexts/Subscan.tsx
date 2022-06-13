// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API_SUBSCAN_KEY } from 'consts';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { useApi } from './Api';
import { useConnect } from './Connect';
import { useUi } from './UI';

export interface SubscanContextState {
  fetchEraPoints: (v: string, e: number) => void;
  payouts: any;
}

export const SubscanContext: React.Context<SubscanContextState> =
  React.createContext({
    fetchEraPoints: (v: string, e: number) => {},
    payouts: [],
  });

export const useSubscan = () => React.useContext(SubscanContext);

export const SubscanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network, isReady } = useApi() as APIContextInterface;
  const { services, getServices }: any = useUi();
  const { activeAccount } = useConnect() as ConnectContextInterface;

  const [payouts, setPayouts]: any = useState([]);

  // reset payouts on network switch
  useEffect(() => {
    setPayouts([]);
  }, [network]);

  // fetch payouts as soon as network is ready
  useEffect(() => {
    if (isReady) {
      fetchPayouts();
    }
  }, [isReady, network, activeAccount]);

  // fetch payouts on services toggle
  useEffect(() => {
    fetchPayouts();
  }, [services]);

  const fetchPayouts = async () => {
    if (activeAccount === null || !services.includes('subscan')) {
      setPayouts([]);
      return;
    }

    let res: any = await fetch(
      network.subscanEndpoint + API_ENDPOINTS.subscanRewardSlash,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_SUBSCAN_KEY,
        },
        body: JSON.stringify({
          row: 60,
          page: 0,
          address: activeAccount,
        }),
        method: 'POST',
      }
    );

    res = await res.json();
    if (res.message === 'Success') {
      if (getServices().includes('subscan')) {
        if (res.data.list !== null) {
          setPayouts(res.data.list);
        } else {
          setPayouts([]);
        }
      }
    }
  };

  const fetchEraPoints = async (address: string, era: number) => {
    if (address === '' || !services.includes('subscan')) {
      return [];
    }
    let res: any = await fetch(
      network.subscanEndpoint + API_ENDPOINTS.subscanEraStat,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_SUBSCAN_KEY,
        },
        body: JSON.stringify({
          row: 60,
          page: 0,
          address,
        }),
        method: 'POST',
      }
    );

    res = await res.json();
    if (res.message === 'Success') {
      if (getServices().includes('subscan')) {
        if (res.data?.list !== null) {
          const list = [];
          for (let i = era; i > era - 60; i--) {
            list.push({
              era: i,
              reward_point:
                res.data.list.find((item: any) => item.era === i)
                  ?.reward_point ?? 0,
            });
          }

          // removes last zero item
          return list.reverse().splice(0, list.length - 1);
        }
        return [];
      }
    }
    return [];
  };

  return (
    <SubscanContext.Provider
      value={{
        fetchEraPoints,
        payouts,
      }}
    >
      {children}
    </SubscanContext.Provider>
  );
};
