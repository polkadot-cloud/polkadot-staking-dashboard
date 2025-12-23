// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { TokenPriceData } from '../types'

const QUERY = gql`
  query TokenPrice($ticker: String!) {
    tokenPrice(ticker: $ticker) {
      price
      change
    }
  }
`

const DEFAULT: TokenPriceData = {
	tokenPrice: {
		price: 0,
		change: 0,
	},
}

export const fetchTokenPrice = async (
	ticker: string,
): Promise<TokenPriceData> => {
	try {
		const result = await client.query<TokenPriceData>({
			query: QUERY,
			variables: { ticker },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}

export const formatTokenPrice = (
	maybePrice: number | null,
	maybeChange: number | null,
): { price: number; change: number } => ({
	price: Number((maybePrice || 0).toFixed(2)),
	change: Number((maybeChange || 0).toFixed(2)),
})
