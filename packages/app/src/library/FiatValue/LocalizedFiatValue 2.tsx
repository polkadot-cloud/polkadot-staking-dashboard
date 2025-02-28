// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import { useTokenPrices } from 'contexts/TokenPrice'
import { formatFiatCurrency } from 'locales/src/util'

interface LocalizedFiatValueProps {
  value?: number | BigNumber
  tokenBalance?: number | BigNumber
  showPlus?: boolean
  wrapParentheses?: boolean
  withApprox?: boolean
}

/**
 * Component for displaying fiat values in the user's local currency.
 * Can accept either a direct value or a token balance to be converted.
 */
export const LocalizedFiatValue = ({
  value,
  tokenBalance,
  showPlus = false,
  wrapParentheses = false,
  withApprox = false,
}: LocalizedFiatValueProps) => {
  const { price } = useTokenPrices()

  const calculateValue = (): number => {
    if (value !== undefined) {
      return typeof value === 'number' ? value : value.toNumber()
    }

    // Calculate from token balance
    if (tokenBalance !== undefined && price) {
      const balance =
        typeof tokenBalance === 'number'
          ? tokenBalance
          : tokenBalance.toNumber()

      return balance * price
    }

    return 0
  }

  const finalValue = calculateValue()

  let formatted = formatFiatCurrency(finalValue)

  if (showPlus && finalValue > 0) {
    formatted = `+${formatted}`
  }

  if (withApprox) {
    formatted = `≈ ${formatted}`
  }

  if (wrapParentheses) {
    formatted = `(${formatted})`
  }

  return formatted
}
