// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { ValidatorEraPointsResult } from '../types'

const QUERY = gql`
  query ValidatorEraPoints(
    $chain: String!
    $validator: String!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorEraPoints(
      chain: $chain
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
  chain,
  validator,
  fromEra,
  depth,
}: {
  chain: string
  validator: string
  fromEra: number
  depth?: number
}): ValidatorEraPointsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, validator, fromEra, depth },
  })
  return { loading, error, data, refetch }
}
