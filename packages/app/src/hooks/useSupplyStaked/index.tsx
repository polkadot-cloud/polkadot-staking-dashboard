// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'

export const useSupplyStaked = () => {
	const {
		stakingMetrics: { lastTotalStake, totalIssuance },
	} = useApi()
	const { network } = useNetwork()
	const { units } = getStakingChainData(network)

	// Total supply as percent
	const totalIssuanceUnit = new BigNumber(planckToUnit(totalIssuance, units))
	const lastTotalStakeUnit = new BigNumber(planckToUnit(lastTotalStake, units))
	const supplyAsPercent =
		lastTotalStakeUnit.isZero() || totalIssuanceUnit.isZero()
			? new BigNumber(0)
			: lastTotalStakeUnit.dividedBy(totalIssuanceUnit.multipliedBy(0.01))

	return {
		supplyString: supplyAsPercent.decimalPlaces(2).toFormat(),
		supplyNumber: supplyAsPercent.decimalPlaces(2).toNumber(),
	}
}
