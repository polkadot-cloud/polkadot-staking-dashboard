// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { fetchAuthChallenge } from 'plugin-gateway'
import type { AuthChallengeResult } from 'plugin-gateway/types'
import { useEffect, useState } from 'react'

export const useAuthChallenge = (address: string | null) => {
	const [data, setData] = useState<AuthChallengeResult | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const handleAuthChallenge = async (addr: string) => {
		try {
			setLoading(true)
			setError(false)

			const result = await fetchAuthChallenge(addr)

			if (result?.authChallenge) {
				setData(result.authChallenge)
			} else {
				setError(true)
			}
		} catch (error) {
			console.error(error)
			setError(true)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (address) {
			handleAuthChallenge(address)
		}
	}, [address])

	return { data, loading, error }
}
