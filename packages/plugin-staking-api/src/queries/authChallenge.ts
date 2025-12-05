// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useMutation } from '@apollo/client'
import { client } from '../Client'
import type { AuthChallengeResult, UseAuthChallengeMutation } from '../types'

const MUTATION = gql`
  mutation AuthChallenge($address: String!) {
    authChallenge(address: $address) {
      challengeId
      message {
        who
        url
        version
        nonce
        issuedAt
        expireAt
      }
    }
  }
`

export const useAuthChallenge = (): UseAuthChallengeMutation => {
	const [authChallenge, { loading, error, data }] = useMutation(MUTATION)
	return { authChallenge, loading, error, data }
}

export const fetchAuthChallenge = async (
	address: string,
): Promise<{ authChallenge: AuthChallengeResult } | null> => {
	try {
		const result = await client.mutate({
			mutation: MUTATION,
			variables: { address },
		})
		return result.data
	} catch {
		return null
	}
}
