// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useNetwork } from 'contexts/Network'
import { isCustomEvent } from 'controllers/utils'
import { formatTokenPrice, useTokenPrice } from 'plugin-staking-api'
import { useRef } from 'react'
import { useEventListener } from 'usehooks-ts'

export const TokenPrice = () => {
  const {
    networkData: {
      api: { unit },
    },
  } = useNetwork()

  const { loading, error, data, refetch } = useTokenPrice({
    ticker: `${unit}USDT`,
  })
  const { price, change } = formatTokenPrice(loading, error, data)

  //  Refetch token price if online status changes to online.
  const handleOnlineStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      if (e.detail.online) {
        refetch()
      }
    }
  }

  // Initiate interval to refetch token price every 30 seconds.
  useEffectIgnoreInitial(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30 * 1000)
    return () => clearInterval(interval)
  }, [refetch])

  useEventListener(
    'online-status',
    handleOnlineStatus,
    useRef<Document>(document)
  )

  return (
    <>
      <div className="stat">
        1 {unit} /{' '}
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
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
