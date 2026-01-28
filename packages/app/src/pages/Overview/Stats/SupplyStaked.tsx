// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { getStakingChainData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useSupplyStaked } from 'hooks/useSupplyStaked'
import { Pie } from 'library/StatCards/Pie'
import { useTranslation } from 'react-i18next'

export const SupplyStaked = () => {
	const { t } = useTranslation('pages')
	const { network } = useNetwork()
	const { supplyString, supplyNumber } = useSupplyStaked()
	const { unit } = getStakingChainData(network)

	const params = {
		label: t('unitSupplyStaked', { unit }),
		stat: {
			value: supplyString,
			unit: '%',
		},
		pieValue: supplyNumber,
		tooltip: `${supplyString}%`,
		helpKey: 'Supply Staked',
	}

	return <Pie {...params} />
}
