// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useNetwork } from 'contexts/Network';
import {
  ApolloProvider,
  client,
  useTokenPrice,
  formatResult,
} from 'plugin-staking-api';

export const TokenPriceInner = () => {
  const {
    networkData: {
      api: { unit },
    },
  } = useNetwork();
  const { loading, error, data, refetch } = useTokenPrice({
    ticker: `${unit}USDT`,
  });
  const { price, change } = formatResult(loading, error, data);

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Initiate interval to refetch token price every 30 seconds.
  useEffectIgnoreInitial(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <>
      <div className="stat">
        <span
          className={`change${change < 0 ? ' neg' : change > 0 ? ' pos' : ''}`}
        >
          {change < 0 ? '' : change > 0 ? '+' : ''}
          {change}%
        </span>
      </div>
      <div className="stat">
        1 {unit} / {usdFormatter.format(price)}
      </div>
    </>
  );
};

export const TokenPrice = () => (
  <ApolloProvider client={client}>
    <TokenPriceInner />
  </ApolloProvider>
);
