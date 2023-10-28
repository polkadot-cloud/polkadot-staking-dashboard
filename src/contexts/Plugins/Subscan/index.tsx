// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isNotZero } from '@polkadot-cloud/utils';
import { format, fromUnixTime } from 'date-fns';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ApiEndpoints,
  ApiSubscanKey,
  DefaultLocale,
  ListItemsPerPage,
} from 'consts';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { sortNonZeroPayouts } from 'library/Graphs/Utils';
import { useErasToTimeLeft } from 'library/Hooks/useErasToTimeLeft';
import { locales } from 'locale';
import type { AnyApi, AnySubscan } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { usePlugins } from '..';
import { defaultSubscanContext } from './defaults';
import type { SubscanContextInterface } from './types';

export const SubscanProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { i18n } = useTranslation();
  const { isReady } = useApi();
  const {
    network,
    networkData: { subscanEndpoint },
  } = useNetwork();
  const { activeAccount } = useActiveAccounts();
  const { activeEra } = useNetworkMetrics();
  const { erasToSeconds } = useErasToTimeLeft();
  const { plugins, pluginEnabled } = usePlugins();

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

  // Reset payouts on network switch.
  useEffectIgnoreInitial(() => {
    resetPayouts();
  }, [network]);

  // Reset payouts on no active account.
  useEffectIgnoreInitial(() => {
    if (!activeAccount) resetPayouts();
  }, [activeAccount]);

  // Reset payouts on subscan plugin not enabled.
  useEffectIgnoreInitial(() => {
    if (!plugins.includes('subscan')) resetPayouts();
    else if (isReady && isNotZero(activeEra.index)) handleFetchPayouts();
  }, [plugins.includes('subscan'), isReady, activeEra]);

  // Fetch payouts as soon as network is ready.
  useEffectIgnoreInitial(() => {
    if (isReady && isNotZero(activeEra.index)) {
      handleFetchPayouts();
    }
  }, [isReady, network, activeAccount, activeEra]);

  // Store start and end date of fetched payouts.
  useEffectIgnoreInitial(() => {
    const filteredPayouts = sortNonZeroPayouts(payouts, poolClaims, true);
    if (filteredPayouts.length) {
      setPayoutsFromDate(
        format(
          fromUnixTime(
            filteredPayouts[filteredPayouts.length - 1].block_timestamp
          ),
          'do MMM',
          {
            locale: locales[i18n.resolvedLanguage ?? DefaultLocale],
          }
        )
      );

      // latest payout date
      setPayoutsToDate(
        format(fromUnixTime(filteredPayouts[0].block_timestamp), 'do MMM', {
          locale: locales[i18n.resolvedLanguage ?? DefaultLocale],
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
    let newClaimedPayouts: AnySubscan[] = [];
    let newUnclaimedPayouts: AnySubscan[] = [];

    // fetch results if subscan is enabled
    if (activeAccount && pluginEnabled('subscan')) {
      // fetch 1 page of results
      const results = await Promise.all([
        handleFetch(0, ApiEndpoints.subscanRewardSlash, 100, {
          address: activeAccount,
          is_stash: true,
        }),
      ]);

      // user may have turned off service while results were fetching.
      // test again whether subscan service is still active.
      if (pluginEnabled('subscan')) {
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
    let newPoolClaims: AnySubscan[] = [];

    // fetch results if subscan is enabled
    if (activeAccount && pluginEnabled('subscan')) {
      // fetch 1 page of results
      const results = await Promise.all([
        handleFetch(0, ApiEndpoints.subscanPoolRewards, 100, {
          address: activeAccount,
        }),
      ]);

      // user may have turned off service while results were fetching.
      // test again whether subscan service is still active.
      if (pluginEnabled('subscan')) {
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
    const res = await handleFetch(0, ApiEndpoints.subscanEraStat, 100, {
      address,
    });

    if (res.message === 'Success') {
      if (pluginEnabled('subscan')) {
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

  /* fetchPoolDetails
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   */
  const fetchPoolDetails = async (poolId: number) => {
    if (!plugins.includes('subscan')) {
      return [];
    }
    const res: Response = await fetch(
      subscanEndpoint + ApiEndpoints.subscanPoolDetails,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ApiSubscanKey,
        },
        body: JSON.stringify({
          pool_id: poolId,
        }),
        method: 'POST',
      }
    );
    const json: AnySubscan = await res.json();
    return json?.data || undefined;
  };

  /* fetchPoolMembers
   * Also checks if subscan service is active *after* the fetch has resolved
   * as the user could have turned off the service while payouts were fetching.
   */
  const fetchPoolMembers = async (poolId: number, page: number) => {
    if (!plugins.includes('subscan')) {
      return [];
    }
    const res = await handleFetch(
      page - 1,
      ApiEndpoints.subscanPoolMembers,
      ListItemsPerPage,
      {
        pool_id: poolId,
      }
    );

    if (res.message === 'Success') {
      if (pluginEnabled('subscan')) {
        if (res.data?.list !== null) {
          const result = res.data?.list || [];
          const list: AnySubscan = [];
          for (const item of result) {
            list.push({
              who: item.account_display.address,
              poolId: item.pool_id,
            });
          }
          // removes last zero item and returns
          return list.reverse().splice(0, list.length - 1);
        }
      }
      return [];
    }
    return [];
  };

  /* handleFetch
   * utility to handle a fetch request to Subscan
   * returns resulting JSON.
   */
  const handleFetch = async (
    page: number,
    endpoint: string,
    row: number,
    body: AnyApi = {}
  ): Promise<AnySubscan> => {
    const bodyJson = {
      row,
      page,
      ...body,
    };
    const res: Response = await fetch(subscanEndpoint + endpoint, {
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
        fetchPoolDetails,
        fetchPoolMembers,
        setUnclaimedPayouts,
      }}
    >
      {children}
    </SubscanContext.Provider>
  );
};

export const SubscanContext = React.createContext<SubscanContextInterface>(
  defaultSubscanContext
);

export const useSubscan = () => React.useContext(SubscanContext);
