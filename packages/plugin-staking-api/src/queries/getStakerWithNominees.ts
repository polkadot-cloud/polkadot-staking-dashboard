// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client/react";
import { client } from '../Client'
import type {
	ActiveStatusWithNominees,
	GetActiveStakerWithNomineesResult,
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

export const useGetStakerWithNominees = ({
	network,
	who,
	addresses,
}: {
	network: string
	who: string
	addresses: string[]
}): GetActiveStakerWithNomineesResult => {
	const { loading, error, data, refetch } = useQuery(QUERY, {
		variables: { network, who, addresses },
	})
	return { loading, error, data, refetch }
}

export const fetchGetStakerWithNominees = async (
	network: string,
	who: string,
	addresses: string[],
): Promise<ActiveStatusWithNominees | null> => {
	try {
		const result = (await client.query({
			query: QUERY,
			variables: { network, who, addresses },
		})) as unknown as GetActiveStakerWithNomineesResult

		return {
			active: result.data.isActiveStaker.active,
			statuses: result.data.getNomineesStatus.statuses,
		}
	} catch {
		return null
	}
}
