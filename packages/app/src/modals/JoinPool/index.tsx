// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useState } from 'react'
import { Form } from './Form'

const poolIds: number[] = [15, 19]

export const JoinPool = () => {
	const { poolsMetaData, bondedPools } = useBondedPools()

	// The selected bonded pool id
	const [selectedPoolId] = useState<number>(
		poolIds[Math.floor(Math.random() * poolIds.length)],
	)

	const metadata = poolsMetaData[selectedPoolId]
	console.debug('JoinPool metadata:', metadata)

	const bondedPool = bondedPools.find((pool) => pool.id === selectedPoolId)!

	return <Form bondedPool={bondedPool} />
}
