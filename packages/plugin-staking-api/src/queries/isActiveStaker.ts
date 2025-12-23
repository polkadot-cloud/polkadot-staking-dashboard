// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'

const QUERY = gql`
  query IsActiveStaker($network: String!, $address: String!) {
    IsActiveStaker(network: $network, address: $address) {
      active
    }
  }
`

export const fetchIsActiveStaker = async (
	network: string,
	address: string,
): Promise<boolean | null> => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { network, address },
		})
		return result.data.IsActiveStaker.active as boolean
	} catch {
		return null
	}
}
