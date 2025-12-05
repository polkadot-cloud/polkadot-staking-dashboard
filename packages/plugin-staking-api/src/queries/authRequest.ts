// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { gql, useMutation } from '@apollo/client'
import { client } from '../Client'
import type { AuthResponseResult, UseAuthResponseMutation } from '../types'

const MUTATION = gql`
  mutation AuthResponse($address: String!, $challengeId: String!, $signature: String!) {
    authResponse(address: $address, challengeId: $challengeId, signature: $signature) {
      sessionId
      expireAt
    }
  }
`

export const useAuthResponse = (): UseAuthResponseMutation => {
	const [authResponse, { loading, error, data }] = useMutation(MUTATION)
	return { authResponse, loading, error, data }
}

export const fetchAuthResponse = async (
	address: string,
	challengeId: string,
	signature: string,
): Promise<{ authResponse: AuthResponseResult } | null> => {
	try {
		const result = await client.mutate({
			mutation: MUTATION,
			variables: { address, challengeId, signature },
		})
		return result.data
	} catch {
		return null
	}
}
