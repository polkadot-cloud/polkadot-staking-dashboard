// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { TokenPrice, UseTokenPriceResult } from '../types'

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

export const fetchTokenPrice = async (
  ticker: string
): Promise<TokenPrice | null> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { ticker },
    })
    return result.data.tokenPrice
  } catch (error) {
    return null
  }
}

export const formatTokenPrice = (
  maybePrice: number | null,
  maybeChange: number | null
): { price: number; change: number } => ({
  price: Number((maybePrice || 0).toFixed(2)),
  change: Number((maybeChange || 0).toFixed(2)),
})
