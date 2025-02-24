// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApolloError } from '@apollo/client'
import { gql, useQuery } from '@apollo/client'
import { getUserFiatCurrency } from '../../../locales/src/util'
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
 * 1. Always gets base USDT pair (e.g. DOTUSDT)
 * 2. For non-USD currencies, fetches USDT-fiat conversion (e.g. USDTEUR)
 * 3. Calculates price by multiplying token-USDT with USDT-fiat rate */
export const fetchLocalTokenPrice = async (
  token: string
): Promise<{ price: number; change: number } | null> => {
  // Always fetch base USDT price
  const baseTicker = token + 'USDT'
  const baseData = await fetchTokenPrice(baseTicker)

  // If we can't get the base price, return null
  if (!baseData?.price) {
    return null
  }

  // Get user's fiat currency preference
  const fiat = getUserFiatCurrency()

  // If no fiat preference or USD, just return the USDT price
  if (!fiat || fiat === 'USD') {
    return baseData
  }

  // For non-USD currencies, get the USDT to fiat conversion rate
  const crossTicker = 'USDT' + fiat
  const crossData = await fetchTokenPrice(crossTicker)

  // If we can't get the conversion rate, fall back to the USDT price
  if (!crossData?.price) {
    return baseData
  }

  // Calculate the final price in the user's local currency
  return {
    price: Number((baseData.price * crossData.price).toFixed(2)),
    change: baseData.change,
  }
}
