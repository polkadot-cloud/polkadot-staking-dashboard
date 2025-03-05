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

// Define currency format types
type CurrencyFormat =
  | 'stronger_than_usd'
  | 'moderate'
  | 'weaker_than_usd'
  | 'much_weaker_than_usd'

// Known stronger currencies (rate < 1 USD)
const STRONGER_CURRENCIES = new Set([
  'EUR',
  'GBP',
  'CHF',
  'KWD',
  'BHD',
  'OMR',
  'JOD',
])

// Moderate currencies (typically around 1-5 USD)
const MODERATE_CURRENCIES = new Set([
  'AUD',
  'CAD',
  'BGN',
  'SGD',
  'NZD',
  'BND',
  'BRL',
  'PLN',
  'ILS',
  'RON',
  'MYR',
  'LYD',
  'QAR',
  'SAR',
  'AED',
])

// Weaker currencies (typically > 5 USD)
const WEAKER_CURRENCIES = new Set([
  'CNY',
  'HKD',
  'DKK',
  'NOK',
  'SEK',
  'ZAR',
  'TRY',
  'MXN',
])

// Much weaker currencies (typically > 50 USD)
const MUCH_WEAKER_CURRENCIES = new Set([
  'JPY',
  'INR',
  'KRW',
  'IDR',
  'CLP',
  'COP',
  'PHP',
  'THB',
  'TWD',
])

/**
 * Dynamically classifies a currency based on its code and actual rate data
 */
const getCurrencyFormat = (currency: string, rate?: number): CurrencyFormat => {
  // First check explicit categories based on known exchange rate patterns
  if (STRONGER_CURRENCIES.has(currency)) {
    return 'stronger_than_usd'
  }

  if (MODERATE_CURRENCIES.has(currency)) {
    return 'moderate'
  }

  if (WEAKER_CURRENCIES.has(currency)) {
    return 'weaker_than_usd'
  }

  if (MUCH_WEAKER_CURRENCIES.has(currency)) {
    return 'much_weaker_than_usd'
  }

  // If currency not in the predefined lists, use rate value to determine category
  if (rate !== undefined) {
    if (rate < 1) {
      return 'stronger_than_usd'
    } else if (rate >= 1 && rate < 5) {
      return 'moderate'
    } else if (rate >= 5 && rate < 50) {
      return 'weaker_than_usd'
    } else {
      return 'much_weaker_than_usd'
    }
  }

  // Default to moderate if we can't determine
  return 'moderate'
}

/**
 * Calculate the correct price in local currency based on currency type and rate
 * @param basePrice Base price in USD
 * @param rate Exchange rate from API
 * @param currency Currency code
 * @returns Calculated price in local currency
 */
const calculateLocalPrice = (
  basePrice: number,
  rate: number,
  currency: string
): number => {
  const currencyFormat = getCurrencyFormat(currency, rate)

  // Normal exchange rate is direct multiplication (USD * rate = local currency)
  // Inverted rate requires division (USD / inverted_rate = local currency)

  switch (currencyFormat) {
    case 'stronger_than_usd':
      // Stronger currencies (EUR, GBP, CHF) should have rates < 1
      // If we get a rate > 1, it's likely the inverse rate
      return rate > 1
        ? Number((basePrice / rate).toFixed(2))
        : Number((basePrice * rate).toFixed(2))

    case 'moderate':
      // Moderate currencies like AUD (1.57) or CAD (1.42)
      // Expect rate to be 1-5, if < 1 then likely inverted
      return rate < 1
        ? Number((basePrice / rate).toFixed(2))
        : Number((basePrice * rate).toFixed(2))

    case 'weaker_than_usd':
      // Weaker currencies like CNY (7.24) or ZAR (18.36)
      // Expect rate to be 5-50, if < 1 then definitely inverted
      return rate < 1
        ? Number((basePrice / rate).toFixed(2))
        : Number((basePrice * rate).toFixed(2))

    case 'much_weaker_than_usd':
      // Much weaker currencies like JPY (149) or IDR (16291)
      // Expect rate to be > 50, if < 1 then definitely inverted
      return rate < 1
        ? Number((basePrice / rate).toFixed(2))
        : Number((basePrice * rate).toFixed(2))

    default:
      // For unknown formats, follow a simple heuristic based on rate magnitude
      if (rate < 0.1) {
        return Number((basePrice / rate).toFixed(2)) // Very small rate is inverted
      } else if (rate > 100) {
        return Number((basePrice * rate).toFixed(2)) // Very large rate is direct
      } else {
        // For rates in between, look at typical patterns
        return rate < 1
          ? Number((basePrice / rate).toFixed(2))
          : Number((basePrice * rate).toFixed(2))
      }
  }
}

/* Fetches token's local price based on user's fiat settings:
 * 1. Always gets base USDT pair (e.g. DOTUSDT or KSMUSDT)
 * 2. For non-USD currencies, fetches USDT-fiat conversion (e.g. USDTGBP for UK users)
 * 3. Calculates price based on the correct direction of exchange rate */
export const fetchLocalTokenPrice = async (
  token: string,
  currency: string
): Promise<{ price: number; change: number } | null> => {
  // Always fetch base USDT price
  const baseTicker = token + 'USDT'
  const baseData = await fetchTokenPrice(baseTicker)

  // If we can't get the base price, return null
  if (!baseData?.price) {
    return null
  }

  // If no fiat preference or USD, just return the USDT price
  if (!currency || currency === 'USD') {
    return baseData
  }

  // For non-USD currencies, get the USDT to fiat conversion rate
  const crossTicker = 'USDT' + currency
  const crossData = await fetchTokenPrice(crossTicker)

  // If we can't get the conversion rate, fall back to the USDT price
  if (!crossData?.price) {
    return baseData
  }

  // Calculate the final price using our enhanced logic
  const finalPrice = calculateLocalPrice(
    baseData.price,
    crossData.price,
    currency
  )

  return {
    price: finalPrice,
    change: baseData.change,
  }
}
