// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql } from '@apollo/client/core'
import { useQuery } from '@apollo/client/react'
import type { CanFastUnstakeResult, FastUnstakeResult } from '../types'

interface Vars {
	network: string
	who: string
}

interface Result {
	canFastUnstake: FastUnstakeResult
}

const QUERY = gql`
  query CanFastUnstake($network: String!, $who: String!) {
    canFastUnstake(network: $network, who: $who) {
      status
    }
  }
`

export const useCanFastUnstake = ({
	network,
	who,
}: {
	network: string
	who: string
}): CanFastUnstakeResult => {
	const { loading, error, data, refetch } = useQuery<Result, Vars>(QUERY, {
		variables: { network, who },
	})
	return { loading, error, data: data!, refetch }
}
