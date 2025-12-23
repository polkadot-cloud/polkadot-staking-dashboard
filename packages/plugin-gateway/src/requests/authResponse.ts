// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { GATEWAY_API_ENDPOINT } from '../config'
import type { AuthResponseResponse, ErrorResponse } from '../types'

/**
 * Submits an authentication response with the signed challenge.
 * @param address - The wallet address
 * @param challengeId - The challenge ID from the auth challenge
 * @param signature - The signed message
 * @returns Promise resolving to the auth response data or null on error
 */
export const fetchAuthResponse = async (
	address: string,
	challengeId: string,
	signature: string,
): Promise<AuthResponseResponse | null> => {
	try {
		const response = await fetch(`${GATEWAY_API_ENDPOINT}/response`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ address, challengeId, signature }),
		})

		if (!response.ok) {
			const errorData = (await response.json()) as ErrorResponse
			console.error(
				`Auth response failed: ${response.status}`,
				errorData.message || errorData.message,
			)
			return null
		}

		const data = (await response.json()) as AuthResponseResponse
		return data
	} catch (error) {
		console.error('Failed to submit auth response:', error)
		return null
	}
}
