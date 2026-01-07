// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { useApi } from 'contexts/Api'
import { usePayouts } from 'contexts/Payouts'
import { defaultUnclaimedRewards } from 'contexts/Payouts/defaults'
import { useUnclaimedRewards } from 'plugin-staking-api'
import { useEffect } from 'react'
import type { Props } from './types'

export const UnclaimedRewardsApi = ({ who, network }: Props) => {
	const { activeEra } = useApi()
	const { setUnclaimedRewards } = usePayouts()
	const { data, loading, error } = useUnclaimedRewards({
		network,
		who,
		fromEra: Math.max(activeEra.index - 1, 0),
	})

	// Reset unclaimed rewards on network change
	useEffectIgnoreInitial(() => {
		setUnclaimedRewards(defaultUnclaimedRewards)
	}, [network])

	// Update unclaimed rewards on total change
	useEffect(() => {
		if (!loading && !error) {
			setUnclaimedRewards(data.unclaimedRewards)
		}
	}, [data.unclaimedRewards.total])

	return null
}
