// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { useTokenPrices } from 'contexts/TokenPrice'

export const TokenPrice = () => {
  const {
    networkData: { unit },
  } = useNetwork()
  const { currency } = useCurrency()
  const { price, change } = useTokenPrices()

  return (
    <>
      <div className="stat">
        1 {unit} /{' '}
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
        }).format(price)}
      </div>
      <div className="stat">
        <span
          className={`change${change < 0 ? ' neg' : change > 0 ? ' pos' : ''}`}
        >
          {change < 0 ? '' : change > 0 ? '+' : ''}
          {change}%
        </span>
      </div>
    </>
  )
}
