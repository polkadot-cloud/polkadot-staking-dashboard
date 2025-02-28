// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import { useTokenPrices } from 'contexts/TokenPrice'
import { formatFiatCurrency } from 'locales/src/util'

interface FiatValueProps {
  tokenBalance: number | BigNumber
  currency?: string
}

export const FiatValue = ({ tokenBalance }: FiatValueProps) => {
  const { price } = useTokenPrices()

  // Convert balance to fiat value
  const balance =
    typeof tokenBalance === 'number' ? tokenBalance : tokenBalance.toNumber()

  const fiatValue = balance * price

  // Format using the user's preferred currency
  return <>{formatFiatCurrency(fiatValue)}</>
}
