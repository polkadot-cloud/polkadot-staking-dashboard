// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
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
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, validator, fromEra, depth },
  })
  return { loading, error, data, refetch }
}
