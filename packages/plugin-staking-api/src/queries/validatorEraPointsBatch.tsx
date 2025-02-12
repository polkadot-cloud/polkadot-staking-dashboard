// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
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
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, validators, fromEra, depth },
  })
  return { loading, error, data, refetch }
}

export const fetchValidatorEraPointsBatch = async (
  network: string,
  validators: string[],
  fromEra: number,
  depth?: number
): Promise<{ validatorEraPointsBatch: ValidatorEraPointsBatch[] }> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network, validators, fromEra, depth },
    })
    return result.data
  } catch (error) {
    return {
      validatorEraPointsBatch: [],
    }
  }
}
