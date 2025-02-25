// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import { useTokenPrices } from 'contexts/TokenPrice'
import { formatFiatCurrency } from 'locales/src/util'

export const Value = ({ totalBalance }: { totalBalance: BigNumber }) => {
  const { price } = useTokenPrices()

  // Convert balance to fiat value
  const freeFiat = totalBalance.multipliedBy(
    new BigNumber(price).decimalPlaces(2)
  )

  // Use the enhanced currency formatting function
  return <>{formatFiatCurrency(freeFiat.toNumber())}</>
}
