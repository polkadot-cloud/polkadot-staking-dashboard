// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { rmCommas } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { useNetwork } from 'contexts/Network'
import { useTokenPrices } from 'contexts/TokenPrice'

export const Value = ({
  tokenBalance,
  currency,
}: {
  tokenBalance: string | number
  currency: string
}) => {
  const { network } = useNetwork()
  const { price } = useTokenPrices()

  // Convert balance to fiat value
  const freeFiat = new BigNumber(rmCommas(String(tokenBalance)))
    .multipliedBy(price)
    .decimalPlaces(2)

  // Formatter for price feed
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })

  if (network === 'westend') {
    return null
  }

  return <>{formatter.format(freeFiat.toNumber())}</>
}
