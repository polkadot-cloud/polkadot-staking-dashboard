// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client';
import type { UseTokenPriceResult } from './types';

const TOKEN_PRICE_QUERY = gql`
  query TokenPrice($ticker: String!) {
    tokenPrice(ticker: $ticker) {
      price
      change
    }
  }
`;

export const useTokenPrice = ({
  ticker,
}: {
  ticker: string;
}): UseTokenPriceResult => {
  const { loading, error, data, refetch } = useQuery(TOKEN_PRICE_QUERY, {
    variables: { ticker },
  });
  return { loading, error, data, refetch };
};
