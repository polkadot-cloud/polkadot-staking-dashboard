// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks';
import BigNumber from 'bignumber.js';
import { useNetwork } from 'contexts/Network';
import {
  ApolloProvider,
  client,
  formatResult,
  useTokenPrice,
} from 'plugin-staking-api';

interface FiatValueProps {
  totalBalance: BigNumber;
}

export const FiatValueInner = ({ totalBalance }: FiatValueProps) => {
  const {
    networkData: {
      api: { unit },
    },
  } = useNetwork();
  const { loading, error, data, refetch } = useTokenPrice({
    ticker: `${unit}USDT`,
  });
  const { price } = formatResult(loading, error, data);

  // Convert balance to fiat value.
  const freeFiat = totalBalance.multipliedBy(
    new BigNumber(price).decimalPlaces(2)
  );

  // Formatter for price feed.
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

  return <>{usdFormatter.format(freeFiat.toNumber())}</>;
};

export const FiatValue = (props: FiatValueProps) => (
  <ApolloProvider client={client}>
    <FiatValueInner {...props} />
  </ApolloProvider>
);
