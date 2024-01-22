// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isNotZero } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { ApiEndpoints, ApiSubscanKey } from 'consts';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import type { AnyApi, AnySubscan } from 'types';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from '../../Api';
import { usePlugins } from '..';
import { defaultSubscanContext } from './defaults';
import type { SubscanContextInterface } from './types';
import { SubscanController } from 'static/SubscanController';

export const SubscanContext = createContext<SubscanContextInterface>(
  defaultSubscanContext
);

export const useSubscan = () => useContext(SubscanContext);

export const SubscanProvider = ({ children }: { children: ReactNode }) => {
  const { isReady } = useApi();
  const {
    network,
    networkData: { subscanEndpoint },
  } = useNetwork();
  const { activeEra } = useNetworkMetrics();
  const { activeAccount } = useActiveAccounts();
  const { plugins, pluginEnabled } = usePlugins();

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

  // Reset payouts on network of active account switch.
  useEffectIgnoreInitial(() => {
    // Reset all payouts.
    SubscanController.resetData();
  }, [network, activeAccount]);

  // Reset payouts on subscan plugin not enabled. Otherwise fetch payouts.
  useEffectIgnoreInitial(() => {
    if (!plugins.includes('subscan')) {
      // Reset all payouts.
      SubscanController.resetData();
    } else if (isReady && isNotZero(activeEra.index)) {
      // Update active network.
      SubscanController.network = network;
      // Fetch payouts for updated `activeAccount` if provided.
      if (activeAccount) {
        SubscanController.handleFetchPayouts(activeAccount);
      }
    }
  }, [plugins.includes('subscan'), isReady, network, activeAccount, activeEra]);

  return (
    <SubscanContext.Provider
      value={{
        fetchEraPoints,
      }}
    >
      {children}
    </SubscanContext.Provider>
  );
};
