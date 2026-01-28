// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useAverageRewardRate } from 'hooks/useAverageRewardRate'
import { Text } from 'library/StatCards/Text'
import { useTranslation } from 'react-i18next'

export const AverageRewardRate = ({
	isPreloading,
}: {
	isPreloading?: boolean
}) => {
	const { t } = useTranslation('pages')
	const { getAverageRewardRate, formatRateAsPercent } = useAverageRewardRate()

	const params = {
		label: `${t('averageRewardRate')}`,
		value: formatRateAsPercent(getAverageRewardRate()),
		helpKey: 'Average Reward Rate',

		primary: true,
		isPreloading,
	}

	return <Text {...params} />
}
