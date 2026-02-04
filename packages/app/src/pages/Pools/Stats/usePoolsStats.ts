// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import type { StatConfig } from 'library/Stats/types'
import { useTranslation } from 'react-i18next'

export const usePoolsStats = (): StatConfig[] => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { counterForBondedPools, minJoinBond, minCreateBond } =
		useApi().poolsConfig
	const { unit, units } = getStakingChainData(network)

	return [
		{
			id: 'active-pools',
			type: 'number',
			label: t('activePools'),
			value: counterForBondedPools,
			unit: '',
			helpKey: 'Active Pools',
		},
		{
			id: 'min-join-bond',
			type: 'number',
			label: t('minimumToJoinPool'),
			value: parseFloat(planckToUnit(minJoinBond, units)),
			decimals: 3,
			unit: ` ${unit}`,
			helpKey: 'Minimum To Join Pool',
		},
		{
			id: 'min-create-bond',
			type: 'number',
			label: t('minimumToCreatePool'),
			value: parseFloat(planckToUnit(minCreateBond, units)),
			decimals: 3,
			unit,
			helpKey: 'Minimum To Create Pool',
		},
	]
}
