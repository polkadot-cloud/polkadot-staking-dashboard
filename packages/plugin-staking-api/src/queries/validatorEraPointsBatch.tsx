// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type {
  ValidatorEraPointsBatch,
  ValidatorEraPointsBatchResult,
} from '../types'

const QUERY = gql`
  query ValidatorEraPointsBatch(
    $chain: String!
    $validators: [String!]!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorEraPointsBatch(
      chain: $chain
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
  chain,
  validators,
  fromEra,
  depth,
}: {
  chain: string
  validators: string[]
  fromEra: number
  depth?: number
}): ValidatorEraPointsBatchResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, validators, fromEra, depth },
  })
  return { loading, error, data, refetch }
}

export const fetchValidatorEraPointsBatch = async (
  chain: string,
  validators: string[],
  fromEra: number,
  depth?: number
): Promise<{ validatorEraPointsBatch: ValidatorEraPointsBatch[] }> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { chain, validators, fromEra, depth },
    })
    return result.data
  } catch (error) {
    return {
      validatorEraPointsBatch: [],
    }
  }
}
