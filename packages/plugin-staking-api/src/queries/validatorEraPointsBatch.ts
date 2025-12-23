// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client'
import { client } from '../Client'
import type { ValidatorEraPointsBatch } from '../types'

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

export const fetchValidatorEraPointsBatch = async (
	network: string,
	validators: string[],
	fromEra: number,
	depth?: number,
): Promise<{ validatorEraPointsBatch: ValidatorEraPointsBatch[] }> => {
	try {
		const result = await client.query({
			query: QUERY,
			variables: { network, validators, fromEra, depth },
		})
		return result.data
	} catch {
		return {
			validatorEraPointsBatch: [],
		}
	}
}
