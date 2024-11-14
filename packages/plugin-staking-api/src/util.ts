// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApolloError } from '@apollo/client';
import type { TokenPriceResult } from './types';

export const formatResult = (
  loading: boolean,
  error: ApolloError | undefined,
  data: TokenPriceResult
) => {
  const price =
    loading || error ? 0 : Number(data?.tokenPrice?.price.toFixed(2)) || 0;
  const change =
    loading || error ? 0 : Number(data?.tokenPrice?.change.toFixed(2)) || 0;

  return { price, change };
};
