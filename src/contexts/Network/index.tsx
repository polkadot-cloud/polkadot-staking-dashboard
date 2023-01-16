// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { AnyApi } from 'types';
import { parseBalance } from 'utils';
import { useApi } from '../Api';
import * as defaults from './defaults';
import { NetworkMetrics, NetworkMetricsContextInterface } from './types';

export const NetworkMetricsContext =
  React.createContext<NetworkMetricsContextInterface>(
    defaults.defaultNetworkContext
  );

export const useNetworkMetrics = () => React.useContext(NetworkMetricsContext);

export const NetworkMetricsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isReady, api, status } = useApi();

  useEffect(() => {
    if (status === 'connecting') {
      setMetrics(defaults.metrics);
    }
  }, [status]);

  // store network metrics in state
  const [metrics, setMetrics] = useState<NetworkMetrics>(defaults.metrics);

  // store network metrics unsubscribe
  const [unsub, setUnsub] = useState<AnyApi>(undefined);

  // manage unsubscribe
  useEffect(() => {
    subscribeToNetworkMetrics();
    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [isReady]);

  // active subscription
  const subscribeToNetworkMetrics = async () => {
    if (!api) return;

    if (isReady) {
      const _unsub = await api.queryMulti(
        [
          api.query.housingFundModule.fundBalance,
          api.query.roleModule.totalMembers,
        ],
        ([fund, totalUsers]: AnyApi) => {
          const decimals = api.registry.chainDecimals[0];
          const _metrics = {
            totalUsers,
            totalHousingFund: parseBalance(fund.total, decimals),
            decimals,
          };
          setMetrics(_metrics);
        }
      );
      setUnsub(_unsub);
    }
  };

  return (
    <NetworkMetricsContext.Provider
      value={{
        metrics,
      }}
    >
      {children}
    </NetworkMetricsContext.Provider>
  );
};
