// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { APIContextInterface } from 'types/api';
import {
  AnyApi,
  NetworkMetricsContextInterface,
  NetworkMetricsState,
} from 'types';
import { useApi } from '../Api';
import * as defaults from './defaults';

export const NetworkMetricsContext =
  React.createContext<NetworkMetricsContextInterface | null>(null);

export const useNetworkMetrics = () => React.useContext(NetworkMetricsContext);

export const NetworkMetricsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api, status } = useApi() as APIContextInterface;

  useEffect(() => {
    if (status === 'connecting') {
      setState(defaults.state);
    }
  }, [status]);

  // store network metrics in state
  const [state, setState] = useState<NetworkMetricsState>(defaults.state);

  // manage unsubscribe
  useEffect(() => {
    subscribeToNetworkMetrics();
    return () => {
      if (state.unsub !== undefined) {
        state.unsub();
      }
    };
  }, [isReady]);

  // active subscription
  const subscribeToNetworkMetrics = async () => {
    if (!api) return;

    if (isReady) {
      const unsub = await api.queryMulti(
        [api.query.staking.activeEra, api.query.balances.totalIssuance],
        ([activeEra, _totalIssuance]: AnyApi) => {
          // determine activeEra: toString used as alternative to `toHuman`, that puts commas in numbers
          let _activeEra = activeEra
            .unwrapOrDefault({
              index: 0,
              start: 0,
            })
            .toString();

          // convert JSON string to object
          _activeEra = JSON.parse(_activeEra);

          const _state = {
            activeEra: _activeEra,
            totalIssuance: _totalIssuance.toBn(),
            unsub,
          };
          setState(_state);
        }
      );

      return unsub;
    }
    return undefined;
  };

  return (
    <NetworkMetricsContext.Provider
      value={{
        metrics: {
          activeEra: state.activeEra,
          totalIssuance: state.totalIssuance,
        },
      }}
    >
      {children}
    </NetworkMetricsContext.Provider>
  );
};
