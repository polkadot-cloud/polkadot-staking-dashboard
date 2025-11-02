// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import type { ValidatorEraPointsResult } from '../types'

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
}): ValidatorEraPointsResult => {
	type ValidatorEraPointsData = {
		validatorEraPoints: Array<{
			era: number
			points: string
			start: number
		}>
	}
	const { loading, error, data, refetch } = useQuery<
		ValidatorEraPointsData,
		{ network: string; validator: string; fromEra: number; depth?: number }
	>(QUERY, {
		variables: { network, validator, fromEra, depth },
	})
	return { loading, error, data: data!, refetch }
}
