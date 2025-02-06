// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useTokenPrices } from 'contexts/TokenPrice'

export const Value = ({ totalBalance }: { totalBalance: BigNumber }) => {
  const { price } = useTokenPrices()

  // Convert balance to fiat value
  const freeFiat = totalBalance.multipliedBy(
    new BigNumber(price).decimalPlaces(2)
  )

  // Formatter for price feed
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return <>{usdFormatter.format(freeFiat.toNumber())}</>
}
