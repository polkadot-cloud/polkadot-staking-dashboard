// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
  const { loading, error, data } = useTokenPrice({ ticker: `${unit}USDT` });
  const { price, change } = formatResult(loading, error, data);

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
        1 {unit} / {price} USD
      </div>
    </>
  );
};

export const TokenPrice = () => (
  <ApolloProvider client={client}>
    <TokenPriceInner />
  </ApolloProvider>
);
