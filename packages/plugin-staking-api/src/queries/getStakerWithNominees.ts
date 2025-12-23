// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type {
	ActiveStatusWithNominees,
	GetActiveStakerWithNomineesData,
} from '../types'

const QUERY = gql`
  query GetStakerWithNominees($network: String!, $who: String!, $addresses: [String!]!) {
  getNomineesStatus(network: $network, who: $who, addresses: $addresses) {
    statuses {
      address
      status
    }
  }
  isActiveStaker(network: $network, address: $who) {
    active
  }
}
`

const DEFAULT: ActiveStatusWithNominees = {
	active: false,
	statuses: [],
}

export const fetchGetStakerWithNominees = async (
	network: string,
	who: string,
	addresses: string[],
): Promise<ActiveStatusWithNominees> => {
	try {
		const result = await client.query<GetActiveStakerWithNomineesData>({
			query: QUERY,
			variables: { network, who, addresses },
		})
		return result?.data
			? {
					active: result.data.isActiveStaker.active,
					statuses: result.data.getNomineesStatus.statuses,
				}
			: {
					active: false,
					statuses: [],
				}
	} catch {
		return DEFAULT
	}
}
