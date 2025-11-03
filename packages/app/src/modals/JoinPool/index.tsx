// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getNetworkKnownPoolIds } from 'consts/util/pools'
import { useNetwork } from 'contexts/Network'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useState } from 'react'
import { Close } from 'ui-overlay'
import { Form } from './Form'

export const JoinPool = () => {
	const { network } = useNetwork()
	const { poolsMetaData, bondedPools } = useBondedPools()

	const poolIds = getNetworkKnownPoolIds(network)

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
