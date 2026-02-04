// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { planckToUnit } from '@w3ux/utils'
import { getStakingChainData } from 'consts/util'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import type { StatConfig } from 'library/Stats/types'
import { useTranslation } from 'react-i18next'

export const useStakeStats = (isPreloading?: boolean): StatConfig[] => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { minJoinBond } = useApi().poolsConfig
	const { unit, units } = getStakingChainData(network)
	const { getAverageRewardRate, formatRateAsPercent } = useAverageRewardRate()

	return [
		{
			id: 'average-reward-rate',
			type: 'text',
			label: t('averageRewardRate'),
			value: formatRateAsPercent(getAverageRewardRate()),
			helpKey: 'Average Reward Rate',
			primary: true,
			isPreloading,
		},
		{
			id: 'min-join-bond',
			type: 'number',
			label: t('minimumToJoinPool'),
			value: parseFloat(planckToUnit(minJoinBond, units)),
			decimals: 3,
			unit: ` ${unit}`,
			helpKey: 'Minimum To Join Pool',
			isPreloading,
		},
	]
}
