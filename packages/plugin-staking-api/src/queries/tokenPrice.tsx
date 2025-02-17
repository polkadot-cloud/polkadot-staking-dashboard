// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApolloError } from '@apollo/client'
import { gql, useQuery } from '@apollo/client'
import { fiatMapping, getUserFiatCurrency } from '../../../locales/src/util'
import { client } from '../Client'
import type {
  TokenPrice,
  TokenPriceResult,
  UseTokenPriceResult,
} from '../types'

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

export const formatTokenPriceFromResult = (
  loading: boolean,
  error: ApolloError | undefined,
  data: TokenPriceResult
) => {
  const maybePrice = loading || error ? 0 : data?.tokenPrice?.price || null
  const maybeChange = loading || error ? 0 : data?.tokenPrice?.change || null
  return formatTokenPrice(maybePrice, maybeChange)
}

export const formatTokenPrice = (
  maybePrice: number | null,
  maybeChange: number | null
): { price: number; change: number } => ({
  price: Number((maybePrice || 0).toFixed(2)),
  change: Number((maybeChange || 0).toFixed(2)),
})

/* Fetches token's local price based on user's fiat settings:
 * 1. Gets base USDT pair (e.g. DOTUSDT)
 * 2. Checks direct fiat pair (e.g. DOTEUR)
 * 3. Falls back to USDT-fiat conversion (e.g. USDTCOP) */
export const fetchLocalTokenPrice = async (
  token: string
): Promise<{ price: number; change: number } | null> => {
  const baseTicker = token + 'USDT'
  const baseData = await fetchTokenPrice(baseTicker)
  if (!baseData?.price) {
    return null
  }

  const fiat = getUserFiatCurrency()
  if (!fiat || fiat === 'USD') {
    return baseData
  }

  const directTicker = token + fiat
  const directData = await fetchTokenPrice(directTicker)
  if (directData?.price && directData.price > 0) {
    return directData
  }

  if (!fiatMapping[fiat]) {
    return baseData
  }

  const crossTicker = 'USDT' + fiat
  const crossData = await fetchTokenPrice(crossTicker)
  if (!crossData?.price) {
    return baseData
  }

  return {
    price: Number((baseData.price * crossData.price).toFixed(2)),
    change: baseData.change,
  }
}
