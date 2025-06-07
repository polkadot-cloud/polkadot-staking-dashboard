// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useQuery } from '@apollo/client'
import { client } from '../Client'
import type { ValidatorStatsData, ValidatorStatsResult } from '../types'

const QUERY = gql`
  query ValidatorStats($network: String!) {
    validatorStats(network: $network) {
      averageRewardRate {
        rate
      }
      averageValidatorCommission
      activeValidatorRanks {
        rank
        validator
      }
    }
  }
`

export const useValidatorStats = ({
  network,
}: {
  network: string
}): ValidatorStatsResult => {
  const { loading, error, data, refetch } = useQuery(QUERY, {
    variables: { network },
  })
  return { loading, error, data, refetch }
}

export const fetchValidatorStats = async (
  network: string
): Promise<ValidatorStatsData> => {
  try {
    const result = await client.query({
      query: QUERY,
      variables: { network },
    })
    return result.data.validatorStats
  } catch (error) {
    return {
      averageRewardRate: {
        rate: 0,
      },
      averageValidatorCommission: 0,
      activeValidatorRanks: [],
    }
  }
}
