// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createSafeContext } from '@w3ux/hooks'
import { getStakingChainData } from 'consts/util'
import { useCurrency } from 'contexts/Currency'
import { useNetwork } from 'contexts/Network'
import { usePlugins } from 'contexts/Plugins'
import { onlineStatus$ } from 'global-bus'
import { fetchTokenPrice, formatTokenPrice } from 'plugin-staking-api'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { defaultTokenPrice } from './defaults'
import type { TokenPricesContextInterface } from './types'

const REFETCH_PRICE_INTERVAL = 30_000 // 30 seconds
export const IGNORE_NETWORKS = ['westend']

export const [TokenPricesContext, useTokenPrices] =
	createSafeContext<TokenPricesContextInterface>()

export const TokenPricesProvider = ({ children }: { children: ReactNode }) => {
	const { network } = useNetwork()
	const { currency } = useCurrency()
	const { pluginEnabled } = usePlugins()
	const { unit } = getStakingChainData(network)

	// Store token price and change
	const [tokenPrice, setTokenPrice] =
		useState<TokenPricesContextInterface>(defaultTokenPrice)

	const getTokenPrice = async () => {
		const { tokenPrice } = await fetchTokenPrice(
			`${unit}${currency}${currency === 'USD' ? 'T' : ''}`,
		)
		setTokenPrice(tokenPrice || defaultTokenPrice)
	}

	useEffect(() => {
		let interval: ReturnType<typeof setTimeout>

		if (pluginEnabled('staking_api') && !IGNORE_NETWORKS.includes(network)) {
			getTokenPrice()
			interval = setInterval(getTokenPrice, REFETCH_PRICE_INTERVAL)
		} else {
			setTokenPrice(defaultTokenPrice)
		}

		return () => clearInterval(interval)
	}, [network, currency, pluginEnabled('staking_api')])

	// Listen to global bus online status
	useEffect(() => {
		const subOnlineStatus = onlineStatus$.subscribe((result) => {
			if (result.online) {
				getTokenPrice()
			}
		})
		return () => {
			subOnlineStatus.unsubscribe()
		}
	}, [])

	return (
		<TokenPricesContext.Provider
			value={{ ...formatTokenPrice(tokenPrice.price, tokenPrice.change) }}
		>
			{children}
		</TokenPricesContext.Provider>
	)
}
