// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ApolloError,
  ApolloQueryResult,
  OperationVariables,
} from '@apollo/client';

export type TokenPriceResult = {
  tokenPrice: {
    price: number;
    change: number;
  };
} | null;

export interface UseTokenPriceResult {
  loading: boolean;
  error: ApolloError | undefined;
  data: TokenPriceResult;
  refetch: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<unknown>>;
}
