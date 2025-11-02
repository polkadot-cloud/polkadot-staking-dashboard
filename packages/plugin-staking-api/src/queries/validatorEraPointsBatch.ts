// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import { client } from '../Client'
import type {
	ValidatorEraPointsBatch,
	ValidatorEraPointsBatchResult,
} from '../types'

const QUERY = gql`
  query ValidatorEraPointsBatch(
    $network: String!
    $validators: [String!]!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorEraPointsBatch(
      network: $network
      validators: $validators
      fromEra: $fromEra
      depth: $depth
    ) {
      validator
      points {
        era
        points
        start
      }
    }
  }
`

export const useValidatorEraPointsBatch = ({
	network,
	validators,
	fromEra,
	depth,
}: {
	network: string
	validators: string[]
	fromEra: number
	depth?: number
}): ValidatorEraPointsBatchResult => {
	type ValidatorEraPointsBatchData = {
		validatorEraPointsBatch: Array<{
			validator: string
			points: Array<{
				era: number
				points: string
				start: number
			}>
		}>
	}
	const { loading, error, data, refetch } = useQuery<
		ValidatorEraPointsBatchData,
		{ network: string; validators: string[]; fromEra: number; depth?: number }
	>(QUERY, {
		variables: { network, validators, fromEra, depth },
	})
	return { loading, error, data: data!, refetch }
}

export const fetchValidatorEraPointsBatch = async (
	network: string,
	validators: string[],
	fromEra: number,
	depth?: number,
): Promise<{ validatorEraPointsBatch: ValidatorEraPointsBatch[] }> => {
	try {
		type ValidatorEraPointsBatchData = {
			validatorEraPointsBatch: Array<{
				validator: string
				points: Array<{
					era: number
					points: string
					start: number
				}>
			}>
		}
		const result = await client.query<
			ValidatorEraPointsBatchData,
			{ network: string; validators: string[]; fromEra: number; depth?: number }
		>({
			query: QUERY,
			variables: { network, validators, fromEra, depth },
		})
		return result.data ?? { validatorEraPointsBatch: [] }
	} catch {
		return {
			validatorEraPointsBatch: [],
		}
	}
}
