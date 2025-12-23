// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { GATEWAY_API_ENDPOINT } from '../config'
import type { AuthChallengeResponse, ErrorResponse } from '../types'

/**
 * Fetches an authentication challenge for the given address.
 * @param address - The wallet address to request a challenge for
 * @returns Promise resolving to the challenge data or null on error
 */
export const fetchAuthChallenge = async (
	address: string,
): Promise<AuthChallengeResponse | null> => {
	try {
		const response = await fetch(`${GATEWAY_API_ENDPOINT}/challenge`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ address }),
		})

		if (!response.ok) {
			const errorData = (await response.json()) as ErrorResponse
			console.error(
				`Auth challenge failed: ${response.status}`,
				errorData.message || errorData.message,
			)
			return null
		}

		const data = (await response.json()) as AuthChallengeResponse
		return data
	} catch {
		return null
	}
}
