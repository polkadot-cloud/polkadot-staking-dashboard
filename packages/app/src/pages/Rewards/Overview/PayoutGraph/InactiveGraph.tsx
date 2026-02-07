// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MaxPayoutDays } from 'consts'
import { getStakingChainData } from 'consts/util'
import { useNetwork } from 'contexts/Network'
import { useThemeValues } from 'contexts/ThemeValues'
import { DefaultLocale, locales } from 'locales'
import { useTranslation } from 'react-i18next'
import { AveragePayoutLine, PayoutBar } from 'ui-graphs'

export const InactiveGraph = () => {
	const { i18n, t } = useTranslation()
	const { network } = useNetwork()
	const { getThemeValue } = useThemeValues()
	const { unit, units } = getStakingChainData(network)

	return (
		<>
			<PayoutBar
				days={MaxPayoutDays}
				height="165px"
				data={{ payouts: [], unclaimedPayouts: [], poolClaims: [] }}
				nominating={false}
				inPool={false}
				syncing={false}
				getThemeValue={getThemeValue}
				unit={unit}
				units={units}
				dateFormat={locales[i18n.resolvedLanguage ?? DefaultLocale].dateFormat}
				labels={{
					payout: t('payouts', { ns: 'app' }),
					poolClaim: t('poolClaim', { ns: 'app' }),
					unclaimedPayouts: t('unclaimedPayouts', { ns: 'app' }),
					pending: t('pending', { ns: 'app' }),
				}}
			/>
			<AveragePayoutLine
				days={MaxPayoutDays}
				average={10}
				height="65px"
				data={{ payouts: [], unclaimedPayouts: [], poolClaims: [] }}
				nominating={false}
				inPool={false}
				getThemeValue={getThemeValue}
				unit={unit}
				units={units}
				labels={{
					payout: t('payouts', { ns: 'app' }),
					dayAverage: t('dayAverage', { ns: 'app' }),
				}}
			/>
		</>
	)
}
