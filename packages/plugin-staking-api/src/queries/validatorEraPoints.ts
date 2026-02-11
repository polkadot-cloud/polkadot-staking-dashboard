// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import type { QueryReturn, ValidatorEraPointsData } from '../types'

const QUERY = gql`
  query ValidatorEraPoints(
    $network: String!
    $validator: String!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorEraPoints(
      network: $network
      validator: $validator
      fromEra: $fromEra
      depth: $depth
    ) {
      era
      points
      start
    }
  }
`
const DEFAULT: ValidatorEraPointsData = {
	validatorEraPoints: [],
}

export const useValidatorEraPoints = ({
	network,
	validator,
	fromEra,
	depth,
}: {
	network: string
	validator: string
	fromEra: number
	depth?: number
}): QueryReturn<ValidatorEraPointsData> => {
	const { loading, error, data, refetch } = useQuery<ValidatorEraPointsData>(
		QUERY,
		{
			variables: { network, validator, fromEra, depth },
		},
	)
	return { loading, error, data: data || DEFAULT, refetch }
}
