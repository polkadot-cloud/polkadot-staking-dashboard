// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useState } from 'react'
import { Close } from 'ui-overlay'
import { Form } from './Form'

// TODO: Abstract this for multi network, fallback to random pool participant (staking API)
const poolIds: number[] = [15, 19]

// TODO: Sync selected pool data from Staking API
export const JoinPool = () => {
	const { poolsMetaData, bondedPools } = useBondedPools()

	// The selected bonded pool id
	const [selectedPoolId] = useState<number>(
		poolIds[Math.floor(Math.random() * poolIds.length)],
	)

	const metadata = poolsMetaData[selectedPoolId]
	const bondedPool = bondedPools.find((pool) => pool.id === selectedPoolId)!

	return (
		<>
			<Close />
			<Form bondedPool={bondedPool} metadata={metadata} />
		</>
	)
}
