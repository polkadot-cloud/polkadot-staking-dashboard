// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { isCustomEvent } from 'controllers/utils'
import { fetchLocalTokenPrice, formatTokenPrice } from 'plugin-staking-api'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useEventListener } from 'usehooks-ts'
import { defaultTokenPricesContext } from './defaults'
import type { TokenPricesContextInterface } from './types'

const REFETCH_PRICE_INTERVAL = 30_000 // 30 seconds
export const IGNORE_NETWORKS = ['westend']

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

  const getTokenPrice = async () => {
    const result = await fetchLocalTokenPrice(unit)
    setTokenPrice(result || defaultTokenPricesContext)
  }

  const handleOnlineStatus = (e: Event) => {
    if (isCustomEvent(e) && e.detail.online) {
      getTokenPrice()
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (pluginEnabled('staking_api') && !IGNORE_NETWORKS.includes(network)) {
      getTokenPrice()
      interval = setInterval(getTokenPrice, REFETCH_PRICE_INTERVAL)
    } else {
      setTokenPrice(defaultTokenPricesContext)
    }

    return () => clearInterval(interval)
  }, [network, pluginEnabled('staking_api')])

  useEventListener(
    'online-status',
    handleOnlineStatus,
    useRef<Document>(document)
  )

  return (
    <TokenPricesContext.Provider
      value={{ ...formatTokenPrice(tokenPrice.price, tokenPrice.change) }}
    >
      {children}
    </TokenPricesContext.Provider>
  )
}
