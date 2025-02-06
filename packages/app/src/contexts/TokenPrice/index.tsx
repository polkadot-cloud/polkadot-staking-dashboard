// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { isCustomEvent } from 'controllers/utils'
import { fetchTokenPrice, formatTokenPrice } from 'plugin-staking-api'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import { defaultTokenPricesContext } from './defaults'
import type { TokenPricesContextInterface } from './types'

const REFETCH_PRICE_INTERVAL = 30 * 1000

export const TokenPricesContext = createContext<TokenPricesContextInterface>(
  defaultTokenPricesContext
)

export const useTokenPrices = () => useContext(TokenPricesContext)

export const TokenPricesProvider = ({ children }: { children: ReactNode }) => {
  const {
    network,
    networkData: { unit },
  } = useNetwork()
  const { pluginEnabled } = usePlugins()

  const [tokenPrice, setTokenPrice] = useState<TokenPricesContextInterface>(
    defaultTokenPricesContext
  )

  // Handler for fetching price from Staking API
  const getTokenPrice = async () => {
    const result = await fetchTokenPrice(`${unit}USDT`)
    setTokenPrice(result || defaultTokenPricesContext)
  }

  //  Refetch token price if online status changes to online
  const handleOnlineStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      if (e.detail.online) {
        getTokenPrice()
      }
    }
  }

  // Mange token price state and interval on plugin / network toggle
  let interval: NodeJS.Timeout
  useEffect(() => {
    if (pluginEnabled('staking_api')) {
      // Fetch token price
      getTokenPrice()
      // Initiate interval to refetch token price every 30 seconds
      interval = setInterval(() => {
        getTokenPrice()
      }, REFETCH_PRICE_INTERVAL)
    } else {
      // Clear interval and set token price to default
      clearInterval(interval)
      setTokenPrice(defaultTokenPricesContext)
    }
    return () => {
      clearInterval(interval)
    }
  }, [network, pluginEnabled('staking_api')])

  useEventListener(
    'online-status',
    handleOnlineStatus,
    useRef<Document>(document)
  )

  const { price, change } = tokenPrice

  return (
    <TokenPricesContext.Provider value={{ ...formatTokenPrice(price, change) }}>
      {children}
    </TokenPricesContext.Provider>
  )
}
