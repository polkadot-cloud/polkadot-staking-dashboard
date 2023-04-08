// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isNotZero } from '@polkadotcloud/utils';
import { ApiEndpoints, ApiSubscanKey } from 'consts';
import { useNetworkMetrics } from 'contexts/Network';
import { format, fromUnixTime } from 'date-fns';
import { sortNonZeroPayouts } from 'library/Graphs/Utils';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { locales } from 'locale';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnyApi, AnySubscan } from 'types';
import { useApi } from '../Api';
import { useConnect } from '../Connect';
import { usePlugins } from '../Plugins';
import { defaultSubscanContext } from './defaults';
import type { SubscanContextInterface } from './types';

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
  const { plugins, getPlugins } = usePlugins();
  const { activeAccount } = useConnect();
  const { activeEra } = useNetworkMetrics();
  const { erasToSeconds } = useErasToTimeLeft();
  const { i18n } = useTranslation();

  // store fetched payouts from Subscan
  const [payouts, setPayouts] = useState<AnySubscan>([]);

  // store fetched pool claims from Subscan
  const [poolClaims, setPoolClaims] = useState<AnySubscan>([]);

  // store fetched unclaimed payouts from Subscan
  const [unclaimedPayouts, setUnclaimedPayouts] = useState<AnyApi>([]);

  // store the start date of fetched payouts and pool claims combined.
  const [payoutsFromDate, setPayoutsFromDate] = useState<string | undefined>();

  // store the end date of fetched payouts and pool claims combined.
  const [payoutsToDate, setPayoutsToDate] = useState<string | undefined>();

  // handle fetching the various types of payout and set state in one render.
  const handleFetchPayouts = async () => {
    if (activeAccount === null || !plugins.includes('subscan')) {
      resetPayouts();
      return;
    }
    const results = await Promise.all([fetchPayouts(), fetchPoolClaims()]);

    const { newClaimedPayouts, newUnclaimedPayouts } = results[0];
    const newPoolClaims = results[1];

    setPayouts(newClaimedPayouts);
    setUnclaimedPayouts(newUnclaimedPayouts);
    setPoolClaims(newPoolClaims);
  };

  // reset all payout state
  const resetPayouts = () => {
    setPayouts([]);
    setUnclaimedPayouts([]);
    setPoolClaims([]);
  };

  // Fetch payouts on plugins toggle.
  useEffect(() => {
    if (isNotZero(activeEra.index)) {
      handleFetchPayouts();
    }
  }, [plugins, activeEra]);

  // Reset payouts on network switch.
  useEffect(() => {
    resetPayouts();
  }, [network]);

  // Fetch payouts as soon as network is ready.
  useEffect(() => {
    if (isReady && isNotZero(activeEra.index)) {
      handleFetchPayouts();
    }
  }, [isReady, network, activeAccount, activeEra]);

  // Store start and end date of fetched payouts.
  useEffect(() => {
    const filteredPayouts = sortNonZeroPayouts(payouts, poolClaims, true);
    if (filteredPayouts.length) {
      setPayoutsFromDate(
        format(
          fromUnixTime(
            filteredPayouts[filteredPayouts.length - 1].block_timestamp
          ),
          'do MMM',
          {
            locale: locales[i18n.resolvedLanguage],
          }
        )
      );

      // latest payout date
      setPayoutsToDate(
        format(fromUnixTime(filteredPayouts[0].block_timestamp), 'do MMM', {
          locale: locales[i18n.resolvedLanguage],
        })
      );
    }
  }, [payouts, poolClaims, unclaimedPayouts]);

  /* fetchPayouts
   * fetches payout history from Subscan.
   * Fetches a total of 300 records from 3 asynchronous requests.
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   * Stores resulting payouts in context state.
   */
  const fetchPayouts = async () => {
    let newClaimedPayouts: Array<AnySubscan> = [];
    let newUnclaimedPayouts: Array<AnySubscan> = [];

    // fetch results if subscan is enabled
    if (activeAccount && getPlugins().includes('subscan')) {
      // fetch 1 page of results
      const results = await Promise.all([
        handleFetch(activeAccount, 0, ApiEndpoints.subscanRewardSlash, {
          is_stash: true,
        }),
      ]);

      // user may have turned off service while results were fetching.
      // test again whether subscan service is still active.
      if (getPlugins().includes('subscan')) {
        for (const result of results) {
          if (!result?.data?.list) {
            break;
          }
          // ensure no payouts have block_timestamp of 0
          const list = result.data.list.filter(
            (l: AnyApi) => l.block_timestamp !== 0
          );
          newClaimedPayouts = newClaimedPayouts.concat(list);

          const unclaimedList = result.data.list.filter(
            (l: AnyApi) => l.block_timestamp === 0
          );

          // Inject block_timestamp for unclaimed payouts. We take the timestamp of the start of the
          // following payout era - this is the time payouts become available to claim by
          // validators.
          unclaimedList.forEach((p: AnyApi) => {
            p.block_timestamp = activeEra.start
              .multipliedBy(0.001)
              .minus(erasToSeconds(activeEra.index.minus(p.era).minus(1)))
              .toNumber();
          });
          newUnclaimedPayouts = newUnclaimedPayouts.concat(unclaimedList);
        }
      }
    }
    return {
      newClaimedPayouts,
      newUnclaimedPayouts,
    };
  };

  /* fetchPoolClaims
   * fetches claim history from Subscan.
   * Fetches a total of 300 records from 3 asynchronous requests.
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   * Stores resulting claims in context state.
   */
  const fetchPoolClaims = async () => {
    let newPoolClaims: Array<AnySubscan> = [];

    // fetch results if subscan is enabled
    if (activeAccount && getPlugins().includes('subscan')) {
      // fetch 1 page of results
      const results = await Promise.all([
        handleFetch(activeAccount, 0, ApiEndpoints.subscanPoolRewards),
      ]);

      // user may have turned off service while results were fetching.
      // test again whether subscan service is still active.
      if (getPlugins().includes('subscan')) {
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
          newPoolClaims = newPoolClaims.concat(list);
        }
      }
    }
    return newPoolClaims;
  };

  /* fetchEraPoints
   * fetches recent era point history for a particular address.
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   * returns eraPoints
   */
  const fetchEraPoints = async (address: string, era: number) => {
    if (address === '' || !plugins.includes('subscan')) {
      return [];
    }

    const res = await handleFetch(address, 0, ApiEndpoints.subscanEraStat);

    if (res.message === 'Success') {
      if (getPlugins().includes('subscan')) {
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

  /* handleFetch
   * utility to handle a fetch request to Subscan
   * returns resulting JSON.
   */
  const handleFetch = async (
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
  };

  return (
    <SubscanContext.Provider
      value={{
        fetchEraPoints,
        payouts,
        poolClaims,
        unclaimedPayouts,
        payoutsFromDate,
        payoutsToDate,
      }}
    >
      {children}
    </SubscanContext.Provider>
  );
};
