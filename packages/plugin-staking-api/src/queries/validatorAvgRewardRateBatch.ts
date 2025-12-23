// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { ValidatorAvgRewardRateBatchData } from '../types'

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
const DEFAULT: ValidatorAvgRewardRateBatchData = {
	validatorAvgRewardRateBatch: [],
}

export const fetchValidatorAvgRewardRateBatch = async (
	chain: string,
	validators: string[],
	fromEra: number,
	depth?: number,
): Promise<ValidatorAvgRewardRateBatchData> => {
	try {
		const result = await client.query<ValidatorAvgRewardRateBatchData>({
			query: QUERY,
			variables: { chain, validators, fromEra, depth },
		})
		return result?.data || DEFAULT
	} catch {
		return DEFAULT
	}
}
