// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { ValidatorRewardsResult } from '../types'

const QUERY = gql`
  query ValidatorRewards(
    $chain: String!
    $validator: String!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorRewards(
      chain: $chain
      validator: $validator
      fromEra: $fromEra
      depth: $depth
    ) {
      era
      reward
      start
    }
  }
`

export const useValidatorRewards = ({
  chain,
  validator,
  fromEra,
  depth,
}: {
  chain: string
  validator: string
  fromEra: number
  depth?: number
}): ValidatorRewardsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { chain, validator, fromEra, depth },
  })
  return { loading, error, data, refetch }
}
