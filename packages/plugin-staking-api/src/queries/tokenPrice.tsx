// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApolloError } from '@apollo/client'
import { gql, useQuery } from '@apollo/client'
import type { TokenPriceResult, UseTokenPriceResult } from '../types'

const QUERY = gql`
  query TokenPrice($ticker: String!) {
    tokenPrice(ticker: $ticker) {
      price
      change
    }
  }
`

export const useTokenPrice = ({
  ticker,
}: {
  ticker: string
}): UseTokenPriceResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { ticker },
  })
  return { loading, error, data, refetch }
}

export const formatTokenPrice = (
  loading: boolean,
  error: ApolloError | undefined,
  data: TokenPriceResult
) => {
  const price =
    loading || error ? 0 : Number(data?.tokenPrice?.price.toFixed(2)) || 0
  const change =
    loading || error ? 0 : Number(data?.tokenPrice?.change.toFixed(2)) || 0

  return { price, change }
}
