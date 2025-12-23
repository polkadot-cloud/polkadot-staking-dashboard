// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client';
import { useQuery } from "@apollo/client/react";
import { client } from '../Client'
import type {
	ValidatorAvgRewardRateBatch,
	ValidatorAvgRewardRateBatchResult,
} from '../types'

const QUERY = gql`
  query ValidatorAvgRewardRateBatch(
    $chain: String!
    $validators: [String!]!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorAvgRewardRateBatch(
      chain: $chain
      validators: $validators
      fromEra: $fromEra
      depth: $depth
    ) {
      validator
      rate
    }
  }
`

export const useValidatorAvgRewardRateBatch = ({
	chain,
	validators,
	fromEra,
	depth,
}: {
	chain: string
	validators: string[]
	fromEra: number
	depth?: number
}): ValidatorAvgRewardRateBatchResult => {
	const { loading, error, data, refetch } = useQuery(QUERY, {
		variables: { chain, validators, fromEra, depth },
	})
	return { loading, error, data, refetch }
}

export const fetchValidatorAvgRewardRateBatch = async (
	chain: string,
	validators: string[],
	fromEra: number,
	depth?: number,
): Promise<{ validatorAvgRewardRateBatch: ValidatorAvgRewardRateBatch[] }> => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { chain, validators, fromEra, depth },
		})
		return result.data
	} catch {
		return {
			validatorAvgRewardRateBatch: [],
		}
	}
}
