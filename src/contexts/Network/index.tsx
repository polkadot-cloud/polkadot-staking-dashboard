// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { AnyApi } from 'types';
import { ZERO } from 'Utils';
import { useApi } from '../Api';
import * as defaults from './defaults';
import { NetworkMetricsContextInterface } from './types';

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
  const { isReady, api } = useApi();

  // store network metrics in state
  const [totalHousingFund, setTotalFund] = useState(ZERO);
  const [totalUsers, setTotalUsers] = useState(0);
  const [decimals, setDecimals] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);

  // store network metrics unsubscribe
  const [unsub, setUnsub] = useState<AnyApi>(undefined);

  // manage unsubscribe
  useEffect(() => {
    subscribeToNetworkMetrics();
    return () => {
      if (unsub) {
        unsub.then();
      }
    };
  }, [isReady]);

  // active subscription
  const subscribeToNetworkMetrics = async () => {
    if (!api) return;

    if (isReady) {
      const _unsub = api.queryMulti(
        [
          api.query.housingFundModule.fundBalance,
          api.query.roleModule.totalMembers,
          api.query.system.number,
        ],
        ([_fund, _totalUsers, _blockNumber]: AnyApi) => {
          setTotalFund(_fund.total);
          setDecimals(api.registry.chainDecimals[0]);
          setBlockNumber(_blockNumber);
          setTotalUsers(_totalUsers);
        }
      );
      setUnsub(_unsub);
    }
  };

  return (
    <NetworkMetricsContext.Provider
      value={{
        totalUsers,
        totalHousingFund,
        blockNumber,
        decimals,
      }}
    >
      {children}
    </NetworkMetricsContext.Provider>
  );
};
