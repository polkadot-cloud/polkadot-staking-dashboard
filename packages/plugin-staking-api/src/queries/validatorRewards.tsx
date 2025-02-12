// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import type { ValidatorRewardsResult } from '../types'

const QUERY = gql`
  query ValidatorRewards(
    $network: String!
    $validator: String!
    $fromEra: Int!
    $depth: Int
  ) {
    validatorRewards(
      network: $network
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
  network,
  validator,
  fromEra,
  depth,
}: {
  network: string
  validator: string
  fromEra: number
  depth?: number
}): ValidatorRewardsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network, validator, fromEra, depth },
  })
  return { loading, error, data, refetch }
}
