// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiEndpoints, ApiSubscanKey } from 'consts';
import { UIContextInterface } from 'contexts/UI/types';
import React, { useCallback, useEffect, useState } from 'react';
import { AnyApi, AnySubscan } from 'types';
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

  // store fetched payouts from Subscan
  const [payouts, setPayouts] = useState<AnySubscan>([]);

  // store fetched pool claims from Subscan
  const [poolClaims, setPoolClaims] = useState<AnySubscan>([]);

  // reset payouts on network switch
  useEffect(() => {
    setPayouts([]);
    setPoolClaims([]);
  }, [network]);

  /* handleFetch
   * utility to handle a fetch request to Subscan
   * returns resulting JSON.
   */
  const handleFetch = useCallback(
    async (
      address: string,
      page: number,
      endpoint: string,
      body: AnyApi = {}
    ): Promise<AnySubscan> => {
      const bodyJson = {
        row: 100,
        page,
        address,
        ...body,
      };
      const res: Response = await fetch(network.subscanEndpoint + endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ApiSubscanKey,
        },
        body: JSON.stringify(bodyJson),
        method: 'POST',
      });
      const resJson: AnySubscan = await res.json();
      return resJson;
    },
    [network.subscanEndpoint]
  );

  /* fetchPayouts
   * fetches payout history from Subscan.
   * Fetches a total of 300 records from 3 asynchronous requests.
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   * Stores resulting payouts in context state.
   */
  const fetchPayouts = useCallback(async () => {
    if (activeAccount === null || !services.includes('subscan')) {
      setPayouts([]);
      return;
    }

    // fetch 2 pages of results if subscan is enabled
    if (getServices().includes('subscan')) {
      let _payouts: Array<AnySubscan> = [];

      // fetch 3 pages of results
      const results = await Promise.all([
        handleFetch(activeAccount, 0, ApiEndpoints.subscanRewardSlash, {
          is_stash: true,
          claimed_filter: 'claimed',
        }),
        handleFetch(activeAccount, 1, ApiEndpoints.subscanRewardSlash, {
          is_stash: true,
          claimed_filter: 'claimed',
        }),
      ]);

      // user may have turned off service while results were fetching.
      // test again whether subscan service is still active.
      if (getServices().includes('subscan')) {
        for (const result of results) {
          if (!result?.data?.list) {
            break;
          }
          // ensure no payouts have block_timestamp of 0
          const list = result.data.list.filter(
            (l: AnyApi) => l.block_timestamp !== 0
          );
          _payouts = _payouts.concat(list);
        }
        setPayouts(_payouts);
      }
    }
  }, [activeAccount, getServices, handleFetch, services]);

  /* fetchPoolClaims
   * fetches claim history from Subscan.
   * Fetches a total of 300 records from 3 asynchronous requests.
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   * Stores resulting claims in context state.
   */
  const fetchPoolClaims = useCallback(async () => {
    if (activeAccount === null || !services.includes('subscan')) {
      setPoolClaims([]);
      return;
    }

    // fetch 2 pages of results if subscan is enabled
    if (getServices().includes('subscan')) {
      let _poolClaims: Array<AnySubscan> = [];

      // fetch 3 pages of results
      const results = await Promise.all([
        handleFetch(activeAccount, 0, ApiEndpoints.subscanPoolRewards),
        handleFetch(activeAccount, 1, ApiEndpoints.subscanPoolRewards),
      ]);

      // user may have turned off service while results were fetching.
      // test again whether subscan service is still active.
      if (getServices().includes('subscan')) {
        for (const result of results) {
          // check incorrectly formatted result object
          if (!result?.data?.list) {
            break;
          }
          // check list has records
          if (!result.data.list.length) {
            break;
          }
          // ensure no payouts have block_timestamp of 0
          const list = result.data.list.filter(
            (l: AnyApi) => l.block_timestamp !== 0
          );
          _poolClaims = _poolClaims.concat(list);
        }
        setPoolClaims(_poolClaims);
      }
    }
  }, [activeAccount, getServices, handleFetch, services]);

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

    const res = await handleFetch(address, 0, ApiEndpoints.subscanEraStat);

    if (res.message === 'Success') {
      if (getServices().includes('subscan')) {
        if (res.data?.list !== null) {
          const list = [];
          for (let i = era; i > era - 100; i--) {
            list.push({
              era: i,
              reward_point:
                res.data.list.find((item: AnySubscan) => item.era === i)
                  ?.reward_point ?? 0,
            });
          }
          // removes last zero item and returns
          return list.reverse().splice(0, list.length - 1);
        }
        return [];
      }
    }
    return [];
  };

  // fetch payouts as soon as network is ready
  useEffect(() => {
    if (isReady) {
      fetchPayouts();
      fetchPoolClaims();
    }
  }, [isReady, network, activeAccount, fetchPayouts, fetchPoolClaims]);

  // fetch payouts on services toggle
  useEffect(() => {
    fetchPayouts();
    fetchPoolClaims();
  }, [fetchPayouts, fetchPoolClaims, services]);

  return (
    <SubscanContext.Provider
      value={{
        fetchEraPoints,
        payouts,
        poolClaims,
      }}
    >
      {children}
    </SubscanContext.Provider>
  );
};
