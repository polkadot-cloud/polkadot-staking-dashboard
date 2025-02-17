// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { useTokenPrices } from 'contexts/TokenPrice'
import { getUserFiatCurrency } from 'locales/src/util'

export const TokenPrice = () => {
  const {
    networkData: {
      api: { unit },
    },
  } = useNetwork()
  const { price, change } = useTokenPrices()
  const fiat = getUserFiatCurrency() || 'USD'

  return (
    <>
      <div className="stat">
        1 {unit} /{' '}
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: fiat,
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
