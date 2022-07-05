// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, API_SUBSCAN_KEY } from 'consts';
import { UIContextInterface } from 'contexts/UI/types';
import { AnySubscan } from 'types';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { useUi } from '../UI';
import { defaultSubscanContext } from './defaults';
import { SubscanContextInterface } from './types';

export const SubscanContext = React.createContext<SubscanContextInterface>(
  defaultSubscanContext
);

export const useSubscan = () => React.useContext(SubscanContext);

export const SubscanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { network, isReady } = useApi();
  const { services, getServices }: UIContextInterface = useUi();
  const { activeAccount } = useConnect();

  const [payouts, setPayouts]: AnySubscan = useState([]);

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

  /* fetchPayouts
   * fetches payout history from Subscan.
   * Fetches a total of 300 records from 3 asynchronous requests.
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   * Stores resulting payouts in context state.
   */
  const fetchPayouts = async () => {
    if (activeAccount === null || !services.includes('subscan')) {
      setPayouts([]);
      return;
    }

    const fetchPayoutPage = async (page: number) => {
      const res: Response = await fetch(
        network.subscanEndpoint + API_ENDPOINTS.subscanRewardSlash,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_SUBSCAN_KEY,
          },
          body: JSON.stringify({
            row: 100,
            page,
            address: activeAccount,
          }),
          method: 'POST',
        }
      );
      const resJson: AnySubscan = await res.json();
      return resJson;
    };

    // fetch 2 pages of results if subscan is enabled
    if (getServices().includes('subscan')) {
      let _payouts: Array<AnySubscan> = [];

      // fetch 3 pages of results
      const results = await Promise.all([
        fetchPayoutPage(0),
        fetchPayoutPage(1),
        fetchPayoutPage(2),
      ]);

      // user may have turned off service while results were fetching.
      // test again whether subscan service is still active.
      if (getServices().includes('subscan')) {
        const maxDays = 60;

        for (const result of results) {
          if (!result?.data?.list) {
            break;
          }
          const { list } = result.data;
          const last = list[list.length - 1];
          const timestamp = last.block_timestamp;

          // if we have reached max amount of days needed, break loop early
          const daysSince = moment().diff(moment.unix(timestamp), 'days');
          if (daysSince > maxDays) {
            break;
          }
          _payouts = _payouts.concat(result.data.list);
        }
        setPayouts(_payouts);
      }
    }
  };

  /* fetchEraPoints
   * fetches recent era point history for a particular address.
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   * returns eraPoints
   */
  const fetchEraPoints = async (address: string, era: number) => {
    if (address === '' || !services.includes('subscan')) {
      return [];
    }
    let res: AnySubscan = await fetch(
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
                res.data.list.find((item: AnySubscan) => item.era === i)
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
