// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useTokenPrices } from 'contexts/TokenPrice'
import { getUserFiatCurrency } from 'locales/src/util'

export const Value = ({ totalBalance }: { totalBalance: BigNumber }) => {
  const { price } = useTokenPrices()

  // Convert balance to fiat value
  const freeFiat = totalBalance.multipliedBy(
    new BigNumber(price).decimalPlaces(2)
  )

  // Get user's fiat currency
  const fiat = getUserFiatCurrency() || 'USD'

  // Use the same formatting as the footer
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: fiat,
  })

  return <>{formatter.format(freeFiat.toNumber())}</>
}
