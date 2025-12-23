// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { QueryReturn, ValidatorRewardsData } from '../types'

const QUERY = gql`
  query ValidatorRewards(
    $network: String!
    $validator: String!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorRewards(
      network: $network
      validator: $validator
      fromEra: $fromEra
      depth: $depth
    ) {
      era
      reward
      start
    }
  }
`

const DEFAULT: ValidatorRewardsData = {
	validatorRewards: [],
}

export const useValidatorRewards = ({
	network,
	validator,
	fromEra,
	depth,
}: {
	network: string
	validator: string
	fromEra: number
	depth?: number
}): QueryReturn<ValidatorRewardsData> => {
	const { loading, error, data, refetch } = useQuery<ValidatorRewardsData>(
		QUERY,
		{
			variables: { network, validator, fromEra, depth },
		},
	)
	return { loading, error, data: data || DEFAULT, refetch }
}
